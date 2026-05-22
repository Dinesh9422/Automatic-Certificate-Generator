import io
import zipfile
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Certificate, CertificateTemplate
from .serializers import (
    CertificateSerializer, CertificateListSerializer,
    CertificateTemplateSerializer, VerifyCertificateSerializer
)
from .services import generate_certificate_pdf, generate_qr_code


class CertificateTemplateViewSet(viewsets.ModelViewSet):
    queryset           = CertificateTemplate.objects.all()
    serializer_class   = CertificateTemplateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CertificateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Certificate.objects.all()
        # Filters
        for param, field in [
            ('cert_type', 'cert_type'), ('department', 'department'),
            ('status', 'status'), ('mode', 'mode'),
        ]:
            val = self.request.query_params.get(param)
            if val:
                qs = qs.filter(**{field: val})
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(name__icontains=search) | Q(cert_code__icontains=search) | Q(roll_no__icontains=search))
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return CertificateListSerializer
        return CertificateSerializer

    def perform_create(self, serializer):
        serializer.save(generated_by=self.request.user)

    # ── Generate (create + produce PDF) ────────────────────────────────────
    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        serializer = CertificateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cert = serializer.save(generated_by=request.user)

        # QR code
        qr_file = generate_qr_code(cert.cert_code)
        cert.qr_code.save(f'qr_{cert.cert_code}.png', qr_file, save=True)

        # PDF
        pdf_file = generate_certificate_pdf(cert)
        cert.pdf_file.save(f'{cert.cert_code}.pdf', pdf_file, save=True)

        # Return PDF
        cert.refresh_from_db()
        response = HttpResponse(cert.pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{cert.cert_code}.pdf"'
        response['X-Cert-Code'] = cert.cert_code
        return response

    # ── Regenerate ──────────────────────────────────────────────────────────
    @action(detail=True, methods=['post'], url_path='regenerate')
    def regenerate(self, request, pk=None):
        cert = self.get_object()
        pdf_file = generate_certificate_pdf(cert)
        cert.pdf_file.save(f'{cert.cert_code}.pdf', pdf_file, save=True)
        cert.refresh_from_db()
        response = HttpResponse(cert.pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{cert.cert_code}.pdf"'
        return response

    # ── Bulk generate ───────────────────────────────────────────────────────
    @action(detail=False, methods=['post'], url_path='bulk-generate')
    def bulk_generate(self, request):
        cert_ids   = request.data.get('cert_ids', [])
        department = request.data.get('department')
        cert_type  = request.data.get('cert_type')

        qs = Certificate.objects.filter(status='active')
        if cert_ids:
            qs = qs.filter(id__in=cert_ids)
        elif department:
            qs = qs.filter(department=department)
        if cert_type:
            qs = qs.filter(cert_type=cert_type)

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            for cert in qs:
                pdf_file = generate_certificate_pdf(cert)
                cert.pdf_file.save(f'{cert.cert_code}.pdf', pdf_file, save=True)
                cert.refresh_from_db()
                with cert.pdf_file.open() as f:
                    zf.writestr(f'{cert.cert_code}_{cert.name}.pdf', f.read())

        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.read(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="bulk_certificates.zip"'
        return response

    # ── Verify by code ──────────────────────────────────────────────────────
    @action(detail=False, methods=['get'], url_path='verify/(?P<code>[^/.]+)', permission_classes=[])
    def verify(self, request, code=None):
        cert = get_object_or_404(Certificate, cert_code=code)
        serializer = VerifyCertificateSerializer(cert)
        return Response({'valid': cert.status == 'active', 'certificate': serializer.data})

    # ── Stats ────────────────────────────────────────────────────────────────
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        from django.db.models import Count
        total  = Certificate.objects.count()
        active = Certificate.objects.filter(status='active').count()
        by_type = Certificate.objects.values('cert_type').annotate(count=Count('id'))
        by_dept = Certificate.objects.values('department').annotate(count=Count('id'))[:5]
        return Response({
            'total': total, 'active': active,
            'revoked': total - active,
            'by_type': list(by_type),
            'top_departments': list(by_dept),
        })

    # ── Departments list ────────────────────────────────────────────────────
    @action(detail=False, methods=['get'], url_path='departments')
    def departments(self, request):
        depts = Certificate.objects.values_list('department', flat=True).distinct()
        return Response(list(depts))
