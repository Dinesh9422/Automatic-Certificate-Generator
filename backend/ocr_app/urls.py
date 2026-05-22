from django.urls import path
from .views import OCRExtractView, OCRHistoryView

urlpatterns = [
    path('extract/', OCRExtractView.as_view(), name='ocr-extract'),
    path('history/', OCRHistoryView.as_view(), name='ocr-history'),
]
