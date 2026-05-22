from django.contrib import admin
from .models import Certificate, CertificateTemplate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display  = ['cert_code', 'name', 'cert_type', 'department', 'status', 'created_at']
    list_filter   = ['cert_type', 'status', 'mode', 'department']
    search_fields = ['name', 'cert_code', 'roll_no', 'email']
    readonly_fields = ['cert_id', 'cert_code', 'created_at', 'updated_at']

@admin.register(CertificateTemplate)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'cert_type', 'is_default', 'created_at']
