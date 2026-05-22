from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AdminUser

@admin.register(AdminUser)
class AdminUserAdmin(UserAdmin):
    list_display  = ['username', 'email', 'role', 'organization', 'mode', 'is_active']
    list_filter   = ['role', 'mode', 'is_active']
    search_fields = ['username', 'email', 'organization']
    fieldsets     = UserAdmin.fieldsets + (
        ('CertifyAI Info', {'fields': ('role', 'organization', 'department', 'phone', 'mode', 'avatar')}),
    )
