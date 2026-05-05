from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Cart, CartItem
from .serializer import CartSerializer, CartItemSerializer
from products.models import Product



class CartView(APIView):

  def get_cart(self, request):
    if request.user.is_authenticated:
      cart, created = Cart.objects.get_or_create(auth_user=request.user)
    else:
      session_id = request.session.session_key
      if not session_id:
        request.session.create()
        session_id = request.session.session_key
      cart, created = Cart.objects.get_or_create(session_id=session_id)
    return cart

  def get(self, request):
    cart = self.get_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data)
  
  def post(self, request):
    cart = self.get_cart(request)
    product_id = request.data.get('product_id')
    variant_id = request.data.get('variant_id')
    quantity = int(request.data.get('quantity', 1))

    try:
      product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
      return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
  
    item, created = CartItem.objects.get_or_create(
      cart=cart,
      product=product,
      variant_id=variant_id,
      defaults={'quantity': quantity}
    )
    if not created:
      item.quantity += quantity
      item.save()
    return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

  def delete(self, request):
    cart = self.get_cart(request)
    cart.clear()
    return Response({'message': 'Cart cleared'})
  

class CartItemUpdate(APIView):

  def put(self, request, item_id):
    try:
      item = CartItem.objects.get(id=item_id)
    except CartItem.DoesNotExist:
      return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    quantity = request.data.get('quantity')
    if quantity:
      item.quantity = int(quantity)
      item.save()
    return Response(CartItemSerializer(item).data, status=status.HTTP_200_OK)
  

  def delete(self, request, item_id):
    try: 
      item = CartItem.objects.get(id=item_id)
      item.delete()
      return Response({'message': 'Item deleted'}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
      return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
