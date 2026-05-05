from django.contrib.auth.models import User
from django.db import models


class Store(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class StoreMembership(models.Model):
    ROLE_OWNER = "owner"
    ROLE_MANAGER = "manager"
    ROLE_SUPPORT = "support"
    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_MANAGER, "Manager"),
        (ROLE_SUPPORT, "Support"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="store_memberships")
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_SUPPORT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "store")

    def __str__(self):
        return f"{self.user.username} - {self.store.slug} ({self.role})"
