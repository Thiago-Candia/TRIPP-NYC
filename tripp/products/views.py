from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Product, ProductImage
from .serializers import ProductSerializer
from django_filters.rest_framework import DjangoFilterBackend
from stores.permissions import CanManageCatalog


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images', 'variants')
    serializer_class = ProductSerializer
    lookup_field = 'id'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_active']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [CanManageCatalog()]

    def get_queryset(self):
        queryset = super().get_queryset()
        store_id = self.request.headers.get("X-Store-Id") or self.request.query_params.get("store_id")
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        if self.action in ['list', 'retrieve']:
            return queryset.filter(is_active=True)
        return queryset

    def perform_create(self, serializer):
        store_id = self.request.headers.get("X-Store-Id") or self.request.data.get("store")
        serializer.save(store_id=store_id if store_id else None)

    @action(detail=True, methods=['post'], permission_classes=[CanManageCatalog], url_path='upload-images')
    def upload_images(self, request, id=None):
        product = self.get_object()
        files = request.FILES.getlist('images')
        if not files:
            return Response({'detail': 'No se enviaron imágenes.'}, status=status.HTTP_400_BAD_REQUEST)

        created = []
        base_order = product.images.count()
        has_primary = product.images.filter(is_primary=True).exists()

        for index, file in enumerate(files):
            image = ProductImage.objects.create(
                product=product,
                image=file,
                order=base_order + index,
                is_primary=(not has_primary and index == 0),
            )
            created.append(image.id)

        return Response({'detail': 'Imágenes cargadas.', 'image_ids': created}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], permission_classes=[CanManageCatalog], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, id=None, image_id=None):
        product = self.get_object()
        image = product.images.filter(id=image_id).first()
        if not image:
            return Response({'detail': 'Imagen no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
