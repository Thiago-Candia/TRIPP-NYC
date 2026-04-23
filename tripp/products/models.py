from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    slug = models.SlugField(max_length=255, unique=True, blank=True)
    sku = models.CharField(max_length=255, unique=True, blank=True)

    stock = models.BooleanField(default=0, validators=[MinValueValidator(0)])

    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Precio antes del descuento'
    )

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    image = models.ImageField(upload_to='products/', null=True, blank=True) 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta():
        ordering = ['-created_at']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def is_on_sale(self):
        return self.compare_at_price and self.compare_at_price > self.price
    
    @property
    def is_in_stock(self):
        return self.stock > 0


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(
        max_length=255, 
        unique=True, 
        blank=True
    )
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name='children'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        if self.parent: 
            return f"{self.parent} > {self.name}"
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)