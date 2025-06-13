from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include('app.urls')),  # Certifique-se de que 
    path('registrar_empresa/', include('registrar_empresa.urls'))
]
