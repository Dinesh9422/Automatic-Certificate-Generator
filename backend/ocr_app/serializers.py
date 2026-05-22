## ocr_app/serializers.py
from rest_framework import serializers
from .models import OCRRecord

class OCRRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = OCRRecord
        fields = '__all__'
        read_only_fields = ['id', 'extracted_data', 'confidence', 'processed_by', 'created_at']
