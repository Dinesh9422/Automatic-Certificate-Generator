from django.db import models
from django.conf import settings


class QRVerificationLog(models.Model):
    cert_code   = models.CharField(max_length=30)
    verified_at = models.DateTimeField(auto_now_add=True)
    ip_address  = models.GenericIPAddressField(null=True, blank=True)
    is_valid    = models.BooleanField(default=False)

    class Meta:
        db_table = 'qr_verification_logs'
        ordering = ['-verified_at']

    def __str__(self):
        return f"{self.cert_code} — {'✅' if self.is_valid else '❌'} @ {self.verified_at:%Y-%m-%d %H:%M}"
