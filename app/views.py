from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import utils
from .models import AdminPersonalizar
from .serializers import AdminPersonalizarSerializer

class DynamicFieldAPI(APIView):
    def post(self, request):
        field_name = request.data.get('field_name')
        field_type = request.data.get('field_type', 'CharField')
        max_length = request.data.get('max_length', 255)
        
        if not field_name:
            return Response(
                {"error": "O parâmetro 'field_name' é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            AdminPersonalizar.add_custom_field(
                field_name=field_name,
                field_type=field_type,
                max_length=max_length
            )
            return Response(
                {
                    "success": True,
                    "message": f"Campo '{field_name}' criado com sucesso",
                    "field_type": field_type,
                    "max_length": max_length
                },
                status=status.HTTP_201_CREATED
            )
        except utils.ProgrammingError as e:
            if "already exists" in str(e):
                return Response(
                    {
                        "error": f"O campo '{field_name}' já existe na tabela",
                        "existing_field": field_name
                    },
                    status=status.HTTP_409_CONFLICT
                )
            return Response(
                {"error": f"Erro de banco de dados: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminPersonalizarAPI(APIView):
    def post(self, request):
        serializer = AdminPersonalizarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)