from django.urls import path
from .views import QRGenerateView, QRVerifyView

urlpatterns = [
    path('generate/<int:cert_id>/', QRGenerateView.as_view(), name='qr-generate'),
    path('verify/<str:code>/',      QRVerifyView.as_view(),   name='qr-verify'),
]
