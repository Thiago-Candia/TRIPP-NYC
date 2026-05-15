from django.urls import path
from .views import CheckoutView, MercadoPagoReturnView, MercadoPagoWebhookView, MyOrdersView, OrderDetailView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("webhook/", MercadoPagoWebhookView.as_view(), name="mp-webhook"),
    path("return/<str:result>/", MercadoPagoReturnView.as_view(), name="mp-return"),
    path("me/", MyOrdersView.as_view(), name="my-orders"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
