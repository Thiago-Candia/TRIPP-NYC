from django.urls import path

from .views import MyStoreMembershipsView

urlpatterns = [
    path("me/", MyStoreMembershipsView.as_view(), name="my-stores"),
]
