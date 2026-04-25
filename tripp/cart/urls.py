from django.urls import path 
from .views import CartView, CartItemUpdate, CartView

app_name = 'cart'

urlpatterns = [ 
  path('', CartView.as_view(), name='cart'),
  path('items/<int:item_id>/', CartItemUpdate.as_view(), name='cart-item-update'),
]