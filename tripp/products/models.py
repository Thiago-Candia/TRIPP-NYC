from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify

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


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )


    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products'
    )

    slug = models.SlugField(max_length=255, unique=True, blank=True)
    sku = models.CharField(max_length=255, unique=True, blank=True)

    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Precio antes del descuento'
    )

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

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
    
    @property
    def discount_percentage(self):
        if not self.is_on_sale:
            return 0
        return round((self.compare_at_price - self.price) / self.compare_at_price * 100)



class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    size_choices = [
        ('XXS', 'XX-Small'),
        ('XS', 'X-Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'X-Large'),
        ('XXL', 'XX-Large'),
        ('XXXL', 'XXX-Large'),
    ]

    size = models.CharField(
        max_length=10, 
        choices=size_choices, 
        blank=True
    )

    color = models.CharField(max_length=50, blank=True)
    color_code = models.CharField(
        max_length=7, 
        blank=True,
        help_text='Hex code: #000000'
    )

    sku = models.CharField(max_length=50, unique=True)

    price_adjustment = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0,
        help_text='Agregar/restar al precio base (+/- $10)'
    )
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    image = models.ImageField(upload_to='products/', null=True, blank=True) 

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    @property
    def final_price(self):
        return self.product.price + self.price_adjustment
    

    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"



class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='images'
    )

    image = models.ImageField(upload_to='products/gallery/%Y/%m/')

    alt_text = models.CharField(
        max_length=255, 
        blank=True,
        help_text='Texto Imagen'
    )
    is_primary = models.BooleanField(
        default=False,
        help_text='Imagen principal del producto'
    )
    
    order = models.IntegerField(
        default=0,
        help_text='Orden de visualización'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', 'order']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"
    
    def save(self, *args, **kwargs):
        # Si es la primera imagen, hacerla primaria automáticamente
        if not ProductImage.objects.filter(product=self.product).exists():
            self.is_primary = True
        
        # Si se marca como primaria, quitar primario de las demás
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        
        super().save(*args, **kwargs)