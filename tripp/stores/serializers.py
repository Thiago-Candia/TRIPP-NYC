from rest_framework import serializers

from .models import Store, StoreMembership


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["id", "name", "slug", "is_active"]


class StoreMembershipSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True)

    class Meta:
        model = StoreMembership
        fields = ["id", "role", "store"]
