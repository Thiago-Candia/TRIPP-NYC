from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
  product = ProductSerializer(read_only=True)
  product_id = serializers.IntegerField(write_only=True)
  variant_id = serializers.IntegerField(write_only=True, required=False)
  subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

  class Meta:
    model = CartItem
    fields = ['id', 'product', 'product_id', 'variant', 'variant_id', 'quantity', 'subtotal', 'added_at']
    read_only_fields = ['id', 'added_at']


class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True, read_only=True)
  total_items = serializers.IntegerField(read_only=True)
  subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
  total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

  class Meta:
    model = Cart
    fields = ['__all__']
    read_only_fields = ['id', 'created_at', 'updated_at']
