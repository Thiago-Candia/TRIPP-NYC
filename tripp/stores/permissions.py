from rest_framework.permissions import BasePermission

from .models import StoreMembership


class IsStoreTeamMember(BasePermission):
    allowed_roles = {"owner", "manager", "support"}

    def has_permission(self, request, view):
        store_id = request.headers.get("X-Store-Id") or request.query_params.get("store_id")
        if not request.user or not request.user.is_authenticated:
            return False
        if not store_id:
            return request.user.is_staff or request.user.is_superuser
        return StoreMembership.objects.filter(
            user=request.user,
            store_id=store_id,
            role__in=self.allowed_roles,
        ).exists()


class CanManageCatalog(IsStoreTeamMember):
    allowed_roles = {"owner", "manager"}
