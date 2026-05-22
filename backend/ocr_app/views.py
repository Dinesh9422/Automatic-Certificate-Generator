import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import OCRRecord
from .serializers import OCRRecordSerializer
from .ocr_service import run_ocr_pipeline


class OCRExtractView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the record
        record = OCRRecord.objects.create(
            uploaded_file=file_obj,
            processed_by=request.user,
        )

        # Run OCR pipeline
        try:
            file_path = os.path.join(settings.MEDIA_ROOT, str(record.uploaded_file))
            result = run_ocr_pipeline(file_path)
            record.extracted_data = result['fields']
            record.confidence     = result['confidence']
            record.save()

            return Response({
                'id':         record.id,
                'fields':     result['fields'],
                'raw_text':   result['raw_text'],
                'confidence': result['confidence'],
            })
        except Exception as e:
            record.delete()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OCRHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = OCRRecord.objects.filter(processed_by=request.user).order_by('-created_at')[:20]
        serializer = OCRRecordSerializer(records, many=True)
        return Response(serializer.data)
