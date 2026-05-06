import hashlib
import hmac
import json
import logging

import mercadopago
from django.conf import settings
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from .email import send_order_confirmation
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer

logger = logging.getLogger(__name__)


# ─── Helper: get or build MP SDK ────────────────────────────────────────────

def get_mp_sdk():
    return mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)


# ─── Helper: resolve the cart from the current request ──────────────────────

def _get_cart(request):
    if request.user.is_authenticated:
        return Cart.objects.filter(auth_user=request.user).first()
    session_id = request.session.session_key
    if session_id:
        return Cart.objects.filter(session_id=session_id).first()
    return None


# ════════════════════════════════════════════════════════════════════════════
# POST /api/orders/checkout/
# ════════════════════════════════════════════════════════════════════════════

class CheckoutView(APIView):
    """
    1. Validate payload (email, shipping address)
    2. Read cart items from session / authenticated user
    3. Create Order + OrderItems in a single transaction
    4. Create a MercadoPago preference
    5. Return the init_point URL to the frontend
    """

    def post(self, request):
        # ── 1. Validate payload ──────────────────────────────────
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # ── 2. Get cart ─────────────────────────────────────────
        cart = _get_cart(request)
        if not cart or not cart.items.exists():
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = list(cart.items.select_related("product", "variant").all())

        # ── 3. Build financials ──────────────────────────────────
        subtotal = sum(item.subtotal for item in cart_items)
        shipping_cost = 0 if subtotal >= 150 else 12_99  # ARS, or override in settings
        total = subtotal + shipping_cost

        # ── 4. Create Order in DB ────────────────────────────────
        with transaction.atomic():
            order = Order.objects.create(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                phone=data.get("phone", ""),
                address_line1=data["address_line1"],
                address_line2=data.get("address_line2", ""),
                city=data["city"],
                state=data["state"],
                zip_code=data["zip_code"],
                country=data.get("country", "AR"),
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                total=total,
            )

            order_items = []
            for item in cart_items:
                price = item.variant.final_price if item.variant else item.product.price
                order_items.append(OrderItem(
                    order=order,
                    product=item.product,
                    variant=item.variant,
                    name=item.product.name,
                    sku=item.variant.sku or item.product.sku or "",
                    price=price,
                    quantity=item.quantity,
                    subtotal=item.subtotal,
                ))
            OrderItem.objects.bulk_create(order_items)

        # ── 5. Create MercadoPago preference ─────────────────────
        sdk = get_mp_sdk()

        mp_items = [
            {
                "id": str(oi.product_id or ""),
                "title": oi.name,
                "quantity": oi.quantity,
                "unit_price": float(oi.price),
                "currency_id": "ARS",
            }
            for oi in order_items
        ]

        if float(shipping_cost) > 0:
            mp_items.append({
                "id": "shipping",
                "title": "Shipping",
                "quantity": 1,
                "unit_price": float(shipping_cost),
                "currency_id": "ARS",
            })

        preference_data = {
            "items": mp_items,
            "payer": {"email": order.email},
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/order-success",
                "failure": f"{settings.FRONTEND_URL}/checkout",
                "pending": f"{settings.FRONTEND_URL}/order-success",
            },
            "auto_return": "approved",
            "external_reference": str(order.id),
            "notification_url": f"{settings.BACKEND_URL}/api/orders/webhook/",
            "statement_descriptor": "TRIPP NYC",
        }

        preference_response = sdk.preference().create(preference_data)

        if preference_response["status"] not in (200, 201):
            logger.error(f"MercadoPago error: {preference_response}")
            return Response(
                {"error": "Could not create payment preference. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        preference = preference_response["response"]
        order.mp_preference_id = preference["id"]
        order.save(update_fields=["mp_preference_id"])

        # Clear cart (best-effort — don't fail checkout if this errors)
        try:
            cart.clear()
        except Exception as exc:
            logger.warning(f"Could not clear cart after checkout: {exc}")

        # Send confirmation email (non-blocking fail)
        send_order_confirmation(order)

        return Response({
            "order_id": order.id,
            "init_point": preference["init_point"],
            "sandbox_init_point": preference.get("sandbox_init_point"),
        }, status=status.HTTP_201_CREATED)


# ════════════════════════════════════════════════════════════════════════════
# GET /api/orders/<pk>/
# ════════════════════════════════════════════════════════════════════════════

class OrderDetailView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related("items").get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)


# ════════════════════════════════════════════════════════════════════════════
# POST /api/orders/webhook/   (MercadoPago → our server)
# ════════════════════════════════════════════════════════════════════════════

@method_decorator(csrf_exempt, name="dispatch")
class MercadoPagoWebhookView(APIView):
    """
    Receives IPN / webhook notifications from MercadoPago.

    MercadoPago sends a POST with topic=payment and id=<payment_id>,
    then we query the MP API to get the real payment status.

    Signature validation uses MERCADOPAGO_WEBHOOK_SECRET from settings.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        # ── Optional: verify MP signature ────────────────────────
        # In production, set MERCADOPAGO_WEBHOOK_SECRET and uncomment:
        #
        # secret = settings.MERCADOPAGO_WEBHOOK_SECRET
        # x_signature = request.headers.get("x-signature", "")
        # x_request_id = request.headers.get("x-request-id", "")
        # data_id = request.query_params.get("data.id", "")
        # manifest = f"id:{data_id};request-id:{x_request_id};"
        # expected = hmac.new(secret.encode(), manifest.encode(), hashlib.sha256).hexdigest()
        # if not hmac.compare_digest(expected, x_signature.split("ts=")[-1].split(",")[0]):
        #     return Response(status=400)

        topic = request.query_params.get("topic") or request.data.get("type")
        payment_id = (
            request.query_params.get("id")
            or request.data.get("data", {}).get("id")
        )

        if topic not in ("payment", "merchant_order") or not payment_id:
            return Response(status=status.HTTP_200_OK)

        sdk = get_mp_sdk()

        try:
            if topic == "payment":
                payment_info = sdk.payment().get(payment_id)["response"]
                external_reference = payment_info.get("external_reference")
                payment_status = payment_info.get("status")  # "approved", "rejected", etc.
                merchant_order_id = str(payment_info.get("order", {}).get("id", ""))
            else:
                # merchant_order topic
                mo_info = sdk.merchant_order().get(payment_id)["response"]
                external_reference = mo_info.get("external_reference")
                merchant_order_id = str(payment_id)
                # Check if all payments are approved
                payments = mo_info.get("payments", [])
                payment_status = (
                    "approved"
                    if payments and all(p["status"] == "approved" for p in payments)
                    else "pending"
                )

        except Exception as exc:
            logger.error(f"MP webhook query failed: {exc}")
            return Response(status=status.HTTP_200_OK)  # Always 200 to MP

        if not external_reference:
            return Response(status=status.HTTP_200_OK)

        try:
            order = Order.objects.get(pk=external_reference)
        except Order.DoesNotExist:
            logger.warning(f"Webhook: order {external_reference} not found")
            return Response(status=status.HTTP_200_OK)

        # Map MP status → our status
        STATUS_MAP = {
            "approved": "paid",
            "rejected": "cancelled",
            "cancelled": "cancelled",
            "refunded": "refunded",
            "charged_back": "refunded",
            "pending": "pending",
            "in_process": "pending",
            "authorized": "pending",
        }
        new_status = STATUS_MAP.get(payment_status, "pending")

        update_fields = ["updated_at"]

        if order.status != new_status:
            order.status = new_status
            update_fields.append("status")

        if payment_id and not order.mp_payment_id:
            order.mp_payment_id = str(payment_id)
            update_fields.append("mp_payment_id")

        if merchant_order_id and not order.mp_merchant_order_id:
            order.mp_merchant_order_id = merchant_order_id
            update_fields.append("mp_merchant_order_id")

        order.save(update_fields=update_fields)

        return Response(status=status.HTTP_200_OK)
