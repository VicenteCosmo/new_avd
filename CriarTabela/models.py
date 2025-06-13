from django.db import models
from django.db import connection
from django.db.utils import ProgrammingError

class TableManager(models.Manager):
    def create_custom_table(self, table_name, fields_definition):
        """
        Cria uma tabela customizada no MySQL
        :param table_name: Nome da tabela (sem espaços ou caracteres especiais)
        :param fields_definition: Lista de dicionários com definição dos campos
        Exemplo:
        [
            {
                "name": "id",
                "type": "int",
                "constraints": "NOT NULL AUTO_INCREMENT PRIMARY KEY"
            },
            {
                "name": "nome",
                "type": "varchar",
                "length": 100,
                "constraints": "NOT NULL"
            }
        ]
        """
        with connection.cursor() as cursor:
            # Verifica se tabela já existe (sintaxe MySQL)
            cursor.execute(f"""
                SELECT COUNT(*)
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = '{table_name}';
            """)
            if cursor.fetchone()[0] > 0:
                raise ProgrammingError(f"Table '{table_name}' already exists")

            # Constrói a query SQL
            columns = []
            for field in fields_definition:
                column_def = f"`{field['name']}` {field['type'].upper()}"
                
                # Adiciona length se aplicável
                if field.get('length'):
                    if field['type'].lower() in ['varchar', 'char', 'varbinary']:
                        column_def += f"({field['length']})"
                    elif field['type'].lower() in ['decimal', 'numeric']:
                        column_def += f"({field['length']},2)"  # Padrão 2 casas decimais
                
                # Adiciona constraints
                if field.get('constraints'):
                    column_def += f" {field['constraints']}"
                
                columns.append(column_def)
            
            # Query final para MySQL
            create_sql = f"""
                CREATE TABLE `{table_name}` (
                    {', '.join(columns)}
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            
            try:
                cursor.execute(create_sql)
                return True
            except Exception as e:
                raise ProgrammingError(f"Error creating table: {str(e)}")

class TableCreator(models.Model):
    objects = TableManager()
    
    class Meta:
        abstract = False