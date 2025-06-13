from django.urls import path
from .views import DynamicFieldAPI, AdminPersonalizarAPI

urlpatterns = [
    path('fields/', DynamicFieldAPI.as_view(), name='dynamic-fields'),
    path('admin-personalizar/', AdminPersonalizarAPI.as_view(), name='admin-personalizar'),
]
