from django.contrib.auth.models import AbstractUser
from django.db import models


class AdminUser(AbstractUser):
    """Custom admin user model for CertifyAI."""

    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('admin',      'Admin'),
        ('viewer',     'Viewer'),
    ]

    MODE_CHOICES = [
        ('college', 'College'),
        ('company', 'Company'),
    ]

    role         = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')
    organization = models.CharField(max_length=255, blank=True)
    department   = models.CharField(max_length=255, blank=True)
    phone        = models.CharField(max_length=20, blank=True)
    mode         = models.CharField(max_length=10, choices=MODE_CHOICES, default='college')
    avatar       = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_users'
        verbose_name = 'Admin User'

    def __str__(self):
        return f"{self.username} ({self.role})"
