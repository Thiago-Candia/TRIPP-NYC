from django.shortcuts import render
from rest_framework import viewsets
from .models import CustomUser
from .serializer import UserProfileSerializer, CustomUserSerializer, UserAddressSerializer

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


