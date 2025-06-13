from django.urls import path
from .views import RegistrarEmpresaView, LoginEmpresaView, PasswordResetRequestView, PasswordResetConfirmView, OneTimePasswordView

urlpatterns = [
    path('registrar', RegistrarEmpresaView.as_view()),
    path('login', LoginEmpresaView.as_view()),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('otp', OneTimePasswordView.as_view())
]
