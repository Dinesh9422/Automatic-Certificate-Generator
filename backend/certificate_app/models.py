import uuid
from django.db import models
from django.conf import settings


class CertificateTemplate(models.Model):
    CERT_TYPE_CHOICES = [
        ('degree',     'Degree Certificate'),
        ('experience', 'Experience Certificate'),
        ('completion', 'Completion Certificate'),
        ('relieving',  'Relieving Certificate'),
    ]
    name        = models.CharField(max_length=100)
    cert_type   = models.CharField(max_length=20, choices=CERT_TYPE_CHOICES)
    template_file = models.FileField(upload_to='templates/', null=True, blank=True)
    is_default  = models.BooleanField(default=False)
    created_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'certificate_templates'

    def __str__(self):
        return f"{self.name} ({self.cert_type})"


class Certificate(models.Model):
    CERT_TYPE_CHOICES = [
        ('degree',     'Degree Certificate'),
        ('experience', 'Experience Certificate'),
        ('completion', 'Completion Certificate'),
        ('relieving',  'Relieving Certificate'),
    ]
    STATUS_CHOICES = [
        ('active',   'Active'),
        ('revoked',  'Revoked'),
        ('expired',  'Expired'),
    ]
    MODE_CHOICES = [
        ('college', 'College'),
        ('company', 'Company'),
    ]

    # Unique identifier
    cert_id      = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    cert_code    = models.CharField(max_length=20, unique=True, blank=True)  # human readable e.g. CERT-M9K2X4

    # Person info
    name         = models.CharField(max_length=200)
    roll_no      = models.CharField(max_length=50, blank=True)
    email        = models.EmailField(blank=True)
    phone        = models.CharField(max_length=20, blank=True)

    # Certificate info
    cert_type    = models.CharField(max_length=20, choices=CERT_TYPE_CHOICES)
    mode         = models.CharField(max_length=10, choices=MODE_CHOICES, default='college')
    department   = models.CharField(max_length=200)
    course       = models.CharField(max_length=200, blank=True)
    designation  = models.CharField(max_length=200, blank=True)
    organization = models.CharField(max_length=200, blank=True)
    cgpa         = models.CharField(max_length=10, blank=True)
    grade        = models.CharField(max_length=10, blank=True)

    # Dates
    start_date   = models.DateField(null=True, blank=True)
    end_date     = models.DateField(null=True, blank=True)
    issue_date   = models.DateField(null=True, blank=True)

    # File & status
    pdf_file     = models.FileField(upload_to='certificates/', null=True, blank=True)
    qr_code      = models.ImageField(upload_to='qrcodes/', null=True, blank=True)
    status       = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    template     = models.ForeignKey(CertificateTemplate, on_delete=models.SET_NULL, null=True, blank=True)

    # Metadata
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'certificates'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.cert_code} — {self.name} ({self.cert_type})"

    def save(self, *args, **kwargs):
        if not self.cert_code:
            import random, string
            self.cert_code = 'CERT-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        super().save(*args, **kwargs)
