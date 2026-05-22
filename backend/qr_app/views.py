import io
import qrcode
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from certificate_app.models import Certificate
from .models import QRVerificationLog


class QRGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cert_id):
        cert = get_object_or_404(Certificate, id=cert_id)
        verify_url = f"https://certifyai.app/verify/{cert.cert_code}"

        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
        qr.add_data(verify_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color='#F0B90B', back_color='#1a1a1a')
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        return HttpResponse(buffer.read(), content_type='image/png')


class QRVerifyView(APIView):
    permission_classes = [AllowAny]  # Public verification endpoint

    def get(self, request, code):
        ip = request.META.get('REMOTE_ADDR')

        try:
            cert = Certificate.objects.get(cert_code=code)
            is_valid = cert.status == 'active'

            QRVerificationLog.objects.create(cert_code=code, ip_address=ip, is_valid=is_valid)

            return Response({
                'valid':   is_valid,
                'cert_id': cert.cert_code,
                'certificate': {
                    'name':         cert.name,
                    'roll_no':      cert.roll_no,
                    'cert_type':    cert.cert_type,
                    'department':   cert.department,
                    'course':       cert.course,
                    'organization': cert.organization,
                    'issue_date':   str(cert.issue_date),
                    'cgpa':         cert.cgpa,
                    'status':       cert.status,
                }
            })
        except Certificate.DoesNotExist:
            QRVerificationLog.objects.create(cert_code=code, ip_address=ip, is_valid=False)
            return Response({'valid': False, 'error': 'Certificate not found.'}, status=404)
