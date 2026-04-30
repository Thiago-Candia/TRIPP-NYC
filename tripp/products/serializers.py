from rest_framework import serializers
from .models import Product, ProductVariant, Category, ProductImage


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


class ProductImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProductImage
    fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductSerializer(serializers.ModelSerializer):
  category_name = serializers.CharField(source='category.name', read_only=True)
  is_on_sale = serializers.SerializerMethodField(read_only=True)
  is_in_stock = serializers.BooleanField(read_only=True)
  discount_percentage = serializers.SerializerMethodField(read_only=True)
  images = ProductImageSerializer(many=True, read_only=True)
  variants = ProductVariantSerializer(many=True, read_only=True)
  primary_image = serializers.SerializerMethodField()

  class Meta:
    model = Product
    fields = '__all__'
    read_only_fields = ['id', 'created_at', 'updated_at']

  def get_is_on_sale(self, obj):
    return obj.is_on_sale

  def get_discount_percentage(self, obj):
    return obj.discount_percentage

  def get_primary_image(self, obj):
    primary = obj.images.filter(is_primary=True).first()
    if primary and primary.image:
      request = self.context.get('request')
      if request:
        return request.build_absolute_uri(primary.image.url)
      return primary.image.url
    return None




