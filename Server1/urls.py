from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registrar_empresa1/', include('app.urls')),
    path('', include('CriarTabela.urls') )
]
