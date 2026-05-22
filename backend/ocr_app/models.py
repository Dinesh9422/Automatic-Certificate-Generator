# ocr_app/models.py
from django.db import models
from django.conf import settings


class OCRRecord(models.Model):
    uploaded_file = models.FileField(upload_to='documents/')
    extracted_data = models.JSONField(default=dict)
    confidence    = models.FloatField(default=0.0)
    processed_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ocr_records'
        ordering = ['-created_at']

    def __str__(self):
        return f"OCR #{self.id} — {self.confidence:.1f}% ({self.created_at:%Y-%m-%d})"
