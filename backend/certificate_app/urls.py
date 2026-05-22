from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CertificateViewSet, CertificateTemplateViewSet

router = DefaultRouter()
router.register('templates', CertificateTemplateViewSet, basename='cert-templates')
router.register('', CertificateViewSet, basename='certificates')

urlpatterns = [
    path('', include(router.urls)),
]
