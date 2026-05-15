from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "name", "sku", "price", "quantity", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "email", "first_name", "last_name", "phone",
            "address_line1", "address_line2", "city", "state", "zip_code", "country",
            "subtotal", "shipping_cost", "total",
            "status", "mp_preference_id", "mp_payment_id",
            "items", "created_at",
        ]
        read_only_fields = ["id", "user", "status", "mp_preference_id", "mp_payment_id", "created_at"]


class CheckoutSerializer(serializers.Serializer):
    """Validates the incoming checkout payload from the frontend."""
    email         = serializers.EmailField()
    first_name    = serializers.CharField(max_length=100)
    last_name     = serializers.CharField(max_length=100)
    phone         = serializers.CharField(max_length=30, required=False, allow_blank=True)
    address_line1 = serializers.CharField(max_length=255)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city          = serializers.CharField(max_length=100)
    state         = serializers.CharField(max_length=100)
    zip_code      = serializers.CharField(max_length=20)
    country       = serializers.CharField(max_length=2, default="AR")
