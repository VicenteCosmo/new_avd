from django.db import models
from django.db import connection, connections

class DynamicModelManager(models.Manager):
    def create_field(self, model, field_name, field_type='CharField', max_length=255, **kwargs):
        #Criar novo campo em uma tabela já exitente
        
        db_type = {
            'CharField': f'VARCHAR({max_length})',
            'IntegerField': 'INT',
            'BooleanField': 'BOOLEAN',
            'DateField': 'DATE',
            'DateTimeField': 'DATETIME',
            'TextField': 'TEXT',
        }.get(field_type, f'VARCHAR({max_length})')
        
        table_name = model._meta.db_table   
        with connection.cursor() as cursor:
            cursor.execute(
                f"ALTER TABLE {table_name} ADD COLUMN {field_name} {db_type}"
            )
            
            #Atualizar o cache do django
            from django.db.migrations.executor import MigrationExecutor
            from django.db import connection
            executor = MigrationExecutor(connections['default'])
            executor.loader.build_graph()
            
            
class DynamicModel(models.Model):
    objects = DynamicModelManager()
    class Meta:
        abstract = True            