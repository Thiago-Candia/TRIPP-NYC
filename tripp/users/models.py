from django.db import models

# Create your models here.


""" 
Datos personales: teléfono, fecha de nacimiento, género
Preferencias: idioma, moneda, newsletter
Información comercial: total_spent, loyalty_points
"""


class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=(('M', 'Masculino'), ('F', 'Femenino')), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


""" 
Maneja la autenticación (email, password, is_active, is_staff)
Campos básicos: email, username, fecha de registro
Permisos y grupos de Django
"""


class CustomUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='user')

    def __str__(self):
        return self.username



""" 
Almacena múltiples direcciones por usuario
Campos: calle, ciudad, estado, zip, país, tipo (envío/facturación)
Un usuario puede tener 5, 10, 20 direcciones guardadas 
"""


class UserAddress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.country}"
