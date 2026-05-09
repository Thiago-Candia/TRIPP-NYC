import hashlib
import hmac
import logging
from decimal import Decimal

try:
    import mercadopago
except ImportError:
    mercadopago = None

from django.conf import settings
from django.db import transaction
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.services import get_or_create_cart
from .email import send_order_confirmation
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer

logger = logging.getLogger(__name__)
SHIPPING_FREE_THRESHOLD = Decimal("150.00")
DEFAULT_SHIPPING_COST = Decimal("12.99")


def _join_url(base_url, path):
    return f"{str(base_url).rstrip('/')}/{path.lstrip('/')}"


def _mp_error_response(preference_response):
    mp_response = preference_response.get("response", {})
    mp_status = preference_response.get("status")
    mp_message = mp_response.get("message") or mp_response.get("error")
    mp_code = mp_response.get("code")

    if mp_status == 401 or mp_code == "unauthorized":
        return Response(
            {
                "error": "Mercado Pago access token is invalid. Replace MERCADOPAGO_ACCESS_TOKEN and restart Django.",
                "mp_status": mp_status,
                "mp_message": mp_message,
                "mp_code": mp_code,
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response(
        {
            "error": "Could not create payment preference. Please try again.",
            "mp_status": mp_status,
            "mp_message": mp_message,
            "mp_code": mp_code,
        },
        status=status.HTTP_502_BAD_GATEWAY,
    )


def get_mp_sdk():
    if mercadopago is None:
        raise ValueError("The mercadopago package is not installed.")
    access_token = getattr(settings, "MERCADOPAGO_ACCESS_TOKEN", "")
    if not access_token:
        raise ValueError("MERCADOPAGO_ACCESS_TOKEN is not configured.")
    return mercadopago.SDK(access_token)


def _get_cart(request):
    return get_or_create_cart(request)


def _get_shipping_cost(subtotal):
    if subtotal >= SHIPPING_FREE_THRESHOLD:
        return Decimal("0.00")
    configured_cost = getattr(settings, "CHECKOUT_SHIPPING_COST", DEFAULT_SHIPPING_COST)
    return Decimal(str(configured_cost))


def _send_confirmation_once(order):
    if order.confirmation_email_sent:
        return
    send_order_confirmation(order)
    order.confirmation_email_sent = True
    order.save(update_fields=["confirmation_email_sent", "updated_at"])


def _get_webhook_data_id(request):
    return (
        request.query_params.get("data.id")
        or request.query_params.get("id")
        or request.data.get("data", {}).get("id")
        or request.data.get("id")
    )


def _is_valid_webhook_signature(request):
    secret = getattr(settings, "MERCADOPAGO_WEBHOOK_SECRET", "")
    if not secret:
        return True

    x_signature = request.headers.get("x-signature", "")
    x_request_id = request.headers.get("x-request-id", "")
    data_id = _get_webhook_data_id(request)
    if not x_signature or not x_request_id or not data_id:
        return False

    signature_parts = {}
    for part in x_signature.split(","):
        key, separator, value = part.strip().partition("=")
        if separator:
            signature_parts[key] = value

    ts = signature_parts.get("ts")
    received_hash = signature_parts.get("v1")
    if not ts or not received_hash:
        return False

    manifest = f"id:{data_id};request-id:{x_request_id};ts:{ts};"
    expected_hash = hmac.new(
        secret.encode("utf-8"),
        manifest.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected_hash, received_hash)


class CheckoutView(APIView):
    """
    Creates a local pending order and a Mercado Pago Checkout Pro preference.
    The order is confirmed only by the Mercado Pago webhook.
    """

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        cart = _get_cart(request)
        if not cart or not cart.items.exists():
            return Response(
                {
                    "error": "Your cart is empty on the server. Add the product again before checkout.",
                    "code": "server_cart_empty",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = list(cart.items.select_related("product", "variant").all())
        subtotal = sum(item.subtotal for item in cart_items)
        shipping_cost = _get_shipping_cost(subtotal)
        total = subtotal + shipping_cost

        try:
            sdk = get_mp_sdk()
        except ValueError as exc:
            logger.error(str(exc))
            return Response(
                {"error": "Payment gateway is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        with transaction.atomic():
            order = Order.objects.create(
                cart=cart,
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
                sku = item.variant.sku if item.variant else item.product.sku
                order_items.append(
                    OrderItem(
                        order=order,
                        product=item.product,
                        variant=item.variant,
                        name=item.product.name,
                        sku=sku or "",
                        price=price,
                        quantity=item.quantity,
                        subtotal=item.subtotal,
                    )
                )
            OrderItem.objects.bulk_create(order_items)

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

        if shipping_cost > 0:
            mp_items.append(
                {
                    "id": "shipping",
                    "title": "Shipping",
                    "quantity": 1,
                    "unit_price": float(shipping_cost),
                    "currency_id": "ARS",
                }
            )

        success_url = _join_url(settings.BACKEND_URL, "/api/orders/return/success/")
        failure_url = _join_url(settings.BACKEND_URL, "/api/orders/return/failure/")
        pending_url = _join_url(settings.BACKEND_URL, "/api/orders/return/pending/")
        webhook_url = _join_url(settings.BACKEND_URL, "/api/orders/webhook/")

        preference_data = {
            "items": mp_items,
            "payer": {"email": order.email},
            "back_urls": {
                "success": success_url,
                "failure": failure_url,
                "pending": pending_url,
            },
            "auto_return": "approved",
            "external_reference": str(order.id),
            "notification_url": webhook_url,
            "statement_descriptor": "TRIPP NYC",
        }

        try:
            preference_response = sdk.preference().create(preference_data)
        except Exception as exc:
            logger.exception("MercadoPago preference creation failed: %s", exc)
            return Response(
                {"error": "Could not create payment preference. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if preference_response["status"] not in (200, 201):
            logger.error("MercadoPago error: %s", preference_response)
            return _mp_error_response(preference_response)

        preference = preference_response["response"]
        order.mp_preference_id = preference["id"]
        order.save(update_fields=["mp_preference_id"])

        return Response(
            {
                "order_id": order.id,
                "init_point": preference["init_point"],
                "sandbox_init_point": preference.get("sandbox_init_point"),
            },
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related("items").get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)


class MercadoPagoReturnView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, result):
        query_string = request.GET.urlencode()
        if result == "failure":
            target = _join_url(settings.FRONTEND_URL, "/checkout")
        else:
            target = _join_url(settings.FRONTEND_URL, "/order-success")

        if query_string:
            target = f"{target}?{query_string}"

        return redirect(target)


@method_decorator(csrf_exempt, name="dispatch")
class MercadoPagoWebhookView(APIView):
    """
    Receives Mercado Pago webhook notifications and updates order status.
    Mercado Pago may retry webhooks, so the paid side effects are idempotent.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        if not _is_valid_webhook_signature(request):
            logger.warning("Rejected MercadoPago webhook with invalid signature")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        topic = (
            request.query_params.get("type")
            or request.query_params.get("topic")
            or request.data.get("type")
        )
        payment_id = _get_webhook_data_id(request)

        if topic not in ("payment", "merchant_order") or not payment_id:
            return Response(status=status.HTTP_200_OK)

        try:
            sdk = get_mp_sdk()
        except ValueError as exc:
            logger.error(str(exc))
            return Response(status=status.HTTP_200_OK)

        try:
            if topic == "payment":
                payment_info = sdk.payment().get(payment_id)["response"]
                external_reference = payment_info.get("external_reference")
                payment_status = payment_info.get("status")
                merchant_order_id = str(payment_info.get("order", {}).get("id", ""))
            else:
                mo_info = sdk.merchant_order().get(payment_id)["response"]
                external_reference = mo_info.get("external_reference")
                merchant_order_id = str(payment_id)
                payments = mo_info.get("payments", [])
                payment_status = (
                    "approved"
                    if payments and all(p["status"] == "approved" for p in payments)
                    else "pending"
                )
        except Exception as exc:
            logger.error("MP webhook query failed: %s", exc)
            return Response(status=status.HTTP_200_OK)

        if not external_reference:
            return Response(status=status.HTTP_200_OK)

        try:
            order = Order.objects.get(pk=external_reference)
        except Order.DoesNotExist:
            logger.warning("Webhook: order %s not found", external_reference)
            return Response(status=status.HTTP_200_OK)

        status_map = {
            "approved": "paid",
            "rejected": "cancelled",
            "cancelled": "cancelled",
            "refunded": "refunded",
            "charged_back": "refunded",
            "pending": "pending",
            "in_process": "pending",
            "authorized": "pending",
        }
        new_status = status_map.get(payment_status, "pending")

        was_paid = order.status == "paid"
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

        if new_status == "paid" and not was_paid:
            try:
                _send_confirmation_once(order)
            except Exception as exc:
                logger.error("Post-payment confirmation failed for order #%s: %s", order.id, exc)

            if order.cart_id:
                try:
                    order.cart.clear()
                except Exception as exc:
                    logger.warning("Could not clear cart for paid order #%s: %s", order.id, exc)

        return Response(status=status.HTTP_200_OK)
