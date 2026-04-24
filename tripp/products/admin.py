from django.contrib import admin
from .models import Product, ProductVariant


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  list_display = ['name', 'parent', 'is_active']
  prepopulated_fields = {'slug': ('name',)}
  list_filter = ['is_active']


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
  list_display = ['name', 'product', 'is_active']
  list_filter = ['is_active', 'is_featured', 'category']
  search_fields = ['product', 'sku', 'is_active']
  prepopulated_fields = {'slug': ('name',)}


  fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'sku', 'description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_at_price')
        }),
        ('Inventory', {
            'fields': ('stock', 'is_active', 'is_featured')
        }),
        ('Media', {
            'fields': ('image',)
        }),
    )