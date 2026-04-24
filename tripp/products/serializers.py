from rest_framework import serializers
from .models import Product, ProductVariant, Category


class CategorySerializer(serializers.ModelSerializer):
  product_count = serializers.SerializerMethodField()

  class Meta:
    model = Category
    fields = ['id', 'name', 'slug', 'parent', 'product_count']

  def get_product_count(self, obj):
    return obj.products.filter(is_active=True).count()



class ProductVariantSerializer(serializers.ModelSerializer):
  final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
  is_in_stock = serializers.BooleanField(read_only=True)

  class Meta:
    model = ProductVariant
    fields = '__all__'
    read_only_fields = ['id', 'created_at', 'updated_at']



class ProductSerializer(serializers.ModelSerializer):
  category_name = serializers.CharField(source='category.name', read_only=True)
  is_on_sale = serializers.SerializerMethodField(read_only=True)
  is_in_stock = serializers.BooleanField(read_only=True)
  discount_porcentage = serializers.SerializerMethodField(read_only=True)
  variants = ProductVariantSerializer(many=True, read_only=True)

  class Meta:
    model = Product
    fields = [ '__all__']
    read_only_fields = ['id', 'created_at', 'updated_at']


