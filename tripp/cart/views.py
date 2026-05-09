from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product, ProductVariant
from .models import CartItem
from .serializer import CartItemSerializer, CartSerializer
from .services import get_or_create_cart


def _get_positive_quantity(request):
    try:
        quantity = int(request.data.get("quantity", 1))
    except (TypeError, ValueError):
        return None
    return quantity if quantity > 0 else None


class CartView(APIView):
    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        quantity = _get_positive_quantity(request)
        if quantity is None:
            return Response(
                {"error": "Quantity must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product_id = request.data.get("product_id")
        variant_id = request.data.get("variant_id")
        cart = get_or_create_cart(request)

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        variant = None
        if variant_id:
            try:
                variant = ProductVariant.objects.get(
                    id=variant_id,
                    product=product,
                    is_active=True,
                )
            except ProductVariant.DoesNotExist:
                return Response(
                    {"error": "Variant not found for this product"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity"])

        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        cart = get_or_create_cart(request)
        cart.clear()
        return Response({"message": "Cart cleared"})


class CartItemUpdate(APIView):
    def put(self, request, item_id):
        quantity = _get_positive_quantity(request)
        if quantity is None:
            return Response(
                {"error": "Quantity must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            item = CartItem.objects.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        item.quantity = quantity
        item.save(update_fields=["quantity"])
        serializer = CartItemSerializer(item, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        item.delete()
        return Response({"message": "Item deleted"}, status=status.HTTP_200_OK)
