from django.urls import path
from .views import CheckoutView, MercadoPagoWebhookView, OrderDetailView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("webhook/", MercadoPagoWebhookView.as_view(), name="mp-webhook"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
