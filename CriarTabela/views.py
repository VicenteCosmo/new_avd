from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TableCreator
from .serializer import CreateTableSerializer
from django.db import connection

class CreateCustomTableView(APIView):
    def post(self, request):
        serializer = CreateTableSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            success = TableCreator.objects.create_custom_table(
                table_name=serializer.validated_data['table_name'],
                fields_definition=serializer.validated_data['fields']
            )
            
            if success:
                return Response(
                    {
                        "status": "success",
                        "table": serializer.validated_data['table_name'],
                        "schema": serializer.validated_data['fields']
                    },
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            error_msg = str(e)
            if "already exists" in error_msg:
                return Response(
                    {"error": error_msg},
                    status=status.HTTP_409_CONFLICT
                )
            elif "syntax" in error_msg or "SQL" in error_msg:
                return Response(
                    {"error": "SQL syntax error: " + error_msg},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(
                {"error": error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class DynamicDataAPI(APIView):
    def post(self, request, table_name):
        try:
            # Verifica se a tabela existe
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = %s", [table_name])
                if cursor.fetchone()[0] == 0:
                    return Response({"error": f"Tabela '{table_name}' não existe"}, status=status.HTTP_404_NOT_FOUND)

            # Valida os dados recebidos
            data = request.data
            if not isinstance(data, dict):
                return Response({"error": "Dados devem ser um objeto JSON"}, status=status.HTTP_400_BAD_REQUEST)

            # Prepara a query dinâmica
            columns = []
            values = []
            placeholders = []
            
            for column, value in data.items():
                columns.append(column)
                values.append(value)
                placeholders.append("%s")

            if not columns:
                return Response({"error": "Nenhum dado fornecido para inserção"}, status=status.HTTP_400_BAD_REQUEST)

            # Executa a inserção
            with connection.cursor() as cursor:
                sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(placeholders)})"
                cursor.execute(sql, values)
            
            return Response({
                "success": True,
                "message": f"Dados inseridos na tabela '{table_name}' com sucesso",
                "table": table_name,
                "inserted_data": data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "error": f"Erro ao inserir dados: {str(e)}",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            
class TableSchemaAPI(APIView):
    def get(self, request, table_name):
        try:
            with connection.cursor() as cursor:
                # Verifica se a tabela existe
                cursor.execute("""
                    SELECT column_name, data_type, column_key, is_nullable, column_default
                    FROM information_schema.columns
                    WHERE table_schema = DATABASE() AND table_name = %s
                """, [table_name])
                
                columns = cursor.fetchall()
                if not columns:
                    return Response({"error": f"Tabela '{table_name}' não encontrada"}, status=404)
                
                schema = []
                for column in columns:
                    constraints = []
                    if column[2] == 'PRI':
                        constraints.append('PRIMARY KEY')
                    if column[2] == 'UNI':
                        constraints.append('UNIQUE')
                    if column[3] == 'NO':
                        constraints.append('NOT NULL')
                    if column[4] and 'auto_increment' in str(column[4]):
                        constraints.append('AUTO_INCREMENT')
                    
                    schema.append({
                        "name": column[0],
                        "type": column[1],
                        "constraints": ' '.join(constraints) if constraints else None
                    })
                
                return Response({"schema": schema})
                
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class ListTablesAPI(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE()
            """)
            tables = [row[0] for row in cursor.fetchall()]
        return Response({"tables": tables})

class TableDataAPI(APIView):
    def get(self, request, table_name):
        with connection.cursor() as cursor:
            # Verifica se a tabela existe
            cursor.execute("""
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() AND table_name = %s
            """, [table_name])
            if cursor.fetchone()[0] == 0:
                return Response({"error": "Table not found"}, status=404)
            
            # Obtém os dados
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 100")
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            
            data = {
                "columns": columns,
                "rows": [dict(zip(columns, row)) for row in rows]
            }
            return Response(data)
        
    def put(self, request, table_name):
        try:
            record_id = request.data.get('id')
            if not record_id:
                return Response({"error": "ID is required"}, status=400)

            set_clause = ", ".join([f"{key} = %s" for key in request.data.keys() if key != 'id'])
            values = [request.data[key] for key in request.data.keys() if key != 'id'] + [record_id]

            with connection.cursor() as cursor:
                cursor.execute(
                    f"UPDATE {table_name} SET {set_clause} WHERE id = %s",
                    values
                )
                if cursor.rowcount == 0:
                    return Response({"error": "Record not found"}, status=404)
                
            return Response({"success": True})
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def delete(self, request, table_name):
        try:
            record_id = request.data.get('id')
            if not record_id:
                return Response({"error": "ID is required"}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(
                    f"DELETE FROM {table_name} WHERE id = %s",
                    [record_id]
                )
                if cursor.rowcount == 0:
                    return Response({"error": "Record not found"}, status=404)
                
            return Response({"success": True})
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
            