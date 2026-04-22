from django.contrib import admin
from .models import Cart, CartItem

# Register your models here.


class CartItemInline(admin.TabularInline):
  model = CartItem
  extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
  list_display = ['user', 'session_id', 'created_at', 'updated_at']
  inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
  list_display = ['cart', 'product', 'variant', 'quantity', 'subtotal']