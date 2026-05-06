from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import StoreMembershipSerializer


class MyStoreMembershipsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        memberships = request.user.store_memberships.select_related("store").all()
        serializer = StoreMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
