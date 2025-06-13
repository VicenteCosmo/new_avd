from rest_framework import serializers
from .models import Registro_de_empresa

class registrarEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro_de_empresa
        fields = ['nome_da_empresa', 'nif', 'endereco', 'representante_legal',
                'email_do_representante', 'telefone', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance      
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email_do_representante = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("As senhas não coincidem")
        return data        