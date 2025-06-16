from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import registrarEmpresaSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer
from .models import Registro_de_empresa
import jwt, datetime
from django.core.mail import send_mail
from django.conf import settings
import secrets
from datetime import timedelta
from django.utils import timezone

class RegistrarEmpresaView(APIView):
    def post(self, request):
        serializer = registrarEmpresaSerializer(data=request.data)
        if serializer.is_valid():
            #Validar se o NIF já existe
            if Registro_de_empresa.objects.filter(nif=serializer.validated_data['nif']).exists():
                return Response({"Error": "NIF já exite!"})
            #Validar se o email já existe
            if Registro_de_empresa.objects.filter(email_do_representante=serializer.validated_data['email_do_representante']).exists():
                return Response({"Error": "Email já exite!"})
            #Validar se o telefone já existe
            if Registro_de_empresa.objects.filter(telefone=serializer.validated_data['telefone']).exists():
                return Response({"Error": "Telefone já exite!"})
        
        serializer.is_valid(raise_exception=True)     
        serializer.save()
        return Response(serializer.data)
        
        
class LoginEmpresaView(APIView):
    def post(self, request):
        nif = request.data['nif']
        email = request.data['email_do_representante']
        password = request.data['password']
        
        user = Registro_de_empresa.objects.filter(nif=nif, email_do_representante=email).first()
        if user is None:
            return Response({"message": "Usuário não existente!"})
        
        if not user.check_password(password):
            return Response({"message": "Senha inválida!"})
        
        # Gerar token e definir expiração (24 horas)
        token1 = get_random_string(length=6, allowed_chars='0123456789')
        user.reset_token = token1
        user.reset_token_expiration = timezone.now() + timedelta(hours=24)
        user.save()

            # Enviar e-mail (substitua com seu próprio template e URL)
        reset_url = f"https://seusite.com/reset-password?token={token1}"
        send_mail(
                'Sua senha de único uso é',
                f'Use este link para redefinir sua senha: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

        
        payload = {
            'id': user.id,
            'nif': user.nif,
            'email': user.email_do_representante,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        
        return Response({"message": "Sucesso!"})
    
class OneTimePasswordView(APIView):
    def post(self, request):
        token = request.data['otp'] 
        
        try:
            user = Registro_de_empresa.objects.get(
                    reset_token=token,
                    reset_token_expiration__gt=timezone.now()
                )
        except Registro_de_empresa.DoesNotExist:
                return Response({"error": "Token inválido ou expirado"}, status=400)
            
        print('token:'+token)    
        
        return Response({"message": "Verificado!1"})
    
 
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email_do_representante']
            try:
                user = Registro_de_empresa.objects.get(email_do_representante=email)
            except Registro_de_empresa.DoesNotExist:
                return Response({"message": "Se o e-mail existir, um link de recuperação será enviado"}, status=200)

            # Gerar token e definir expiração (24 horas)
            token = get_random_string(length=6, allowed_chars='0123456789')
            user.reset_token = token
            user.reset_token_expiration = timezone.now() + timedelta(hours=24)
            user.save()

            # Enviar e-mail (substitua com seu próprio template e URL)
            reset_url = f"https://seusite.com/reset-password?token={token}"
            send_mail(
                'Recuperação de Senha',
                f'Use este link para redefinir sua senha: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({"message": "Se o e-mail existir, um link de recuperação será enviado"}, status=200)
        return Response(serializer.errors, status=400)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                user = Registro_de_empresa.objects.get(
                    reset_token=token,
                    reset_token_expiration__gt=timezone.now()
                )
            except Registro_de_empresa.DoesNotExist:
                return Response({"error": "Token inválido ou expirado"}, status=400)

            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_expiration = None
            user.save()

            return Response({"message": "Senha redefinida com sucesso"}, status=200)
        return Response(serializer.errors, status=400)    
        
                
