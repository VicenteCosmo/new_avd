from django.db import models
from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.db import connections
from django.contrib.auth.models import AbstractBaseUser

class DynamicModelManager(models.Manager):
    def create_field(self, model, field_name, field_type='CharField', max_length=255, **kwargs):
        """
        Cria um novo campo em uma tabela existente
        """
        db_type = {
            'CharField': f'VARCHAR({max_length})',
            'IntegerField': 'INT',
            'BooleanField': 'BOOLEAN',
            'DateField': 'DATE',
            'DateTimeField': 'DATETIME',
            'TextField': 'TEXT',
        }.get(field_type, f'VARCHAR({max_length})')
            
        table_name = model._meta.db_table
        
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"ALTER TABLE {table_name} ADD COLUMN {field_name} {db_type}"
                )
            
            # Atualizar o cache do Django
            executor = MigrationExecutor(connections['default'])
            executor.loader.build_graph()
            
            return True
        except Exception as e:
            print(f"Erro ao criar campo: {str(e)}")
            raise e

class DynamicModel(models.Model):
    objects = DynamicModelManager()
    
    class Meta:
        abstract = True

class Registrar_Empresa(AbstractBaseUser):
    last_login = models.DateTimeField(null=True, blank=True)
    nome_da_empresa = models.TextField(max_length=255)
    nif = models.CharField(max_length=100, unique=True)
    endereco = models.TextField(max_length=255)
    representante_legal = models.TextField(max_length=255)
    email_do_representante = models.EmailField(max_length=100, unique=True)
    telefone = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=100)
    
    USERNAME_FIELD = 'nif'
    REQUIRED_FIELDS = []

class AdminPersonalizar(DynamicModel, AbstractBaseUser):
    nome = models.CharField(max_length=100)
    
    @classmethod
    def add_custom_field(cls, field_name, field_type='CharField', **kwargs):
        """
        Adiciona um novo campo personalizado à tabela
        """
        try:
            # Cria a coluna no banco de dados
            cls.objects.create_field(cls, field_name, field_type, **kwargs)
            
            # Adiciona o campo ao modelo dinamicamente
            field_class = {
                'CharField': models.CharField,
                'IntegerField': models.IntegerField,
                'BooleanField': models.BooleanField,
                'DateField': models.DateField,
                'DateTimeField': models.DateTimeField,
                'TextField': models.TextField,
            }.get(field_type, models.CharField)
            
            field = field_class(**kwargs)
            field.contribute_to_class(cls, field_name)
            
            return True
        except Exception as e:
            print(f"Erro ao adicionar campo: {str(e)}")
            raise e