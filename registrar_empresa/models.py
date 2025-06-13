from django.db import models
from django.contrib.auth.models import AbstractUser

class Registro_de_empresa(AbstractUser):
    username = None
    last_login = None
    first_name = None
    last_name = None
    password = None
    email = None
    is_staff = None
    is_active = None
    nome_da_empresa = models.TextField(max_length=255)
    nif = models.CharField(max_length=100, unique=True)
    endereco = models.TextField(max_length=255)
    representante_legal = models.TextField(max_length=255)
    email_do_representante = models.EmailField(max_length=100, unique=True)
    telefone = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=100)
    
    reset_token = models.CharField(max_length=255, blank=True, null=True)
    reset_token_expiration = models.DateTimeField(blank=True, null=True)
    
    USERNAME_FIELD = 'nif'
    REQUIRED_FIELDS = []
    
    
