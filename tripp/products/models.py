from django.db import models

# Create your models here.





""" 


. PRODUCTS (Catálogo de Productos)
Propósito: Gestión completa del catálogo
Models:

Category (categorías jerárquicas)
Brand (marcas)
Product (productos)
ProductVariant (tallas, colores)
ProductImage (imágenes múltiples)
ProductReview (reseñas)
ProductTag (etiquetas/tags)

Bibliotecas:

Pillow - Procesamiento de imágenes
django-imagekit - Optimización de imágenes
django-mptt - Categorías jerárquicas
django-taggit - Sistema de tags

"""


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name



class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
