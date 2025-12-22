from rest_framework import serializers
from .models import (
    UserProfile, 
    CustomUser,
    UserAddress
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['__all__']


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ['__all__']



class CustomUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    addresses = UserAddressSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'profile', 'addresses']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        addresses_data = validated_data.pop('addresses')
        user = CustomUser.objects.create(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        for address_data in addresses_data:
            UserAddress.objects.create(user=user, **address_data)
        return user