
from django.urls import include, path
from rest_framework import routers

from . import views
from .auth_views import CurrentUserView, LoginView, RegisterView

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
]

