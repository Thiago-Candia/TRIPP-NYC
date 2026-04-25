from django.db import models
from users.models import CustomUser
from products.models import Product, ProductVariant


class Cart(models.Model):
  user = models.OneToOneField(
    CustomUser,
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='cart'
  )

  session_id = models.CharField(
    max_length=255, 
    null=True, 
    blank=True
  )

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)


  @property
  def total_items(self):
    return sum(item.quantity for item in self.items.all())
  
  @property
  def subtotal(self):
    return sum(item.subtotal for item in self.items.all())
  

  @property
  def total(self):
    return self.subtotal

  def clear(self):
    self.items.all().delete()

  def __str__(self):
    if self.user:
      return f"Cart for {self.user}"
    return f"Cart with session ID: {self.session_id}"
  

  class Meta:
    verbose_name = 'Cart Item'
    verbose_name_plural = 'Cart Items'



class CartItem(models.Model):
  cart = models.ForeignKey(
    Cart, 
    on_delete=models.CASCADE, 
    related_name='items'
  )
  product = models.ForeignKey(
    'products.Product',
    on_delete=models.CASCADE
    )
  
  variant = models.ForeignKey(
    ProductVariant,
    on_delete=models.CASCADE,
    null=True,
    blank=True
    )

  quantity = models.PositiveIntegerField(default=1)
  added_at = models.DateTimeField(auto_now_add=True)
  class Meta:
    unique_together = ['cart', 'product', 'variant']
  def __str__(self):
    return f"{self.quantity} x {self.product.name} ({self.variant.name})"
  
  @property
  def subtotal(self):
    price = self.variant.final_price if self.variant else self.product.price
    return price * self.quantity
