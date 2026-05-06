from django.contrib.auth.models import User
from rest_framework import serializers
from stores.models import StoreMembership
from django.db import DatabaseError


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class CurrentUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    stores = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "is_staff", "is_superuser", "stores"]

    def get_role(self, obj):
        if obj.is_staff or obj.is_superuser:
            return "admin"
        try:
            membership = (
                StoreMembership.objects.filter(user=obj)
                .order_by("role")
                .first()
            )
        except DatabaseError:
            return "user"
        return membership.role if membership else "user"

    def get_stores(self, obj):
        try:
            memberships = StoreMembership.objects.filter(user=obj).select_related("store")
        except DatabaseError:
            return []
        return [
            {
                "store_id": membership.store_id,
                "store_name": membership.store.name,
                "store_slug": membership.store.slug,
                "role": membership.role,
            }
            for membership in memberships
        ]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=False, allow_blank=True)
