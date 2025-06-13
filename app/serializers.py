from rest_framework import serializers
from .models import AdminPersonalizar

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class AdminPersonalizarSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = AdminPersonalizar
        fields = '__all__'
        
    def get_fields(self):
        fields = super().get_fields()
        
        # Adiciona campos dinâmicos
        dynamic_fields = getattr(self.Meta.model, '_meta', {}).get('fields', [])
        for field_name in dynamic_fields:
            if field_name not in fields and hasattr(self.Meta.model, field_name):
                fields[field_name] = serializers.CharField(
                    required=False,
                    allow_null=True
                )
        
        return fields