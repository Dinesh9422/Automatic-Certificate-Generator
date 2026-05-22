from rest_framework import serializers
from .models import Certificate, CertificateTemplate


class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CertificateTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'created_by']


class CertificateSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.username', read_only=True)

    class Meta:
        model  = Certificate
        fields = '__all__'
        read_only_fields = ['id', 'cert_id', 'cert_code', 'pdf_file', 'qr_code', 'created_at', 'updated_at', 'generated_by']


class CertificateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view."""
    class Meta:
        model  = Certificate
        fields = ['id', 'cert_code', 'name', 'roll_no', 'cert_type', 'department', 'status', 'issue_date', 'created_at']


class BulkGenerateSerializer(serializers.Serializer):
    department  = serializers.CharField()
    cert_type   = serializers.ChoiceField(choices=['degree', 'experience', 'completion', 'relieving'])
    year        = serializers.IntegerField()
    student_ids = serializers.ListField(child=serializers.IntegerField(), required=False)


class VerifyCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Certificate
        fields = ['cert_code', 'name', 'roll_no', 'cert_type', 'department', 'course',
                  'organization', 'issue_date', 'cgpa', 'status', 'created_at']
