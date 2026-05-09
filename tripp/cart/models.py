from django.contrib.auth.models import User
from django.db import models

from products.models import ProductVariant
from users.models import CustomUser


class Cart(models.Model):
    auth_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="auth_cart",
    )
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cart",
    )
    session_id = models.CharField(max_length=255, null=True, blank=True)
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
        if self.auth_user:
            return f"Cart for {self.auth_user}"
        if self.user:
            return f"Cart for {self.user}"
        return f"Cart with session ID: {self.session_id}"

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["cart", "product", "variant"]

    def __str__(self):
        variant_label = f" ({self.variant})" if self.variant else ""
        return f"{self.quantity} x {self.product.name}{variant_label}"

    @property
    def subtotal(self):
        price = self.variant.final_price if self.variant else self.product.price
        return price * self.quantity
