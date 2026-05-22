from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers
import os
from django.conf import settings

from .models import ATSAnalysis
from .ats_service import run_ats_pipeline


class ATSAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATSAnalysis
        fields = '__all__'
        read_only_fields = ['id', 'analyzed_by', 'created_at']


class ATSAnalyzeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('resume')
        if not file_obj:
            return Response({'error': 'No resume file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        job_role    = request.data.get('job_role', '')
        job_desc    = request.data.get('job_description', '')

        if not job_role:
            return Response({'error': 'job_role is required.'}, status=status.HTTP_400_BAD_REQUEST)

        record = ATSAnalysis.objects.create(
            resume_file=file_obj,
            job_role=job_role,
            job_description=job_desc,
            analyzed_by=request.user,
        )

        try:
            file_path = os.path.join(settings.MEDIA_ROOT, str(record.resume_file))
            result = run_ats_pipeline(file_path, job_role, job_desc)

            for field, value in result.items():
                setattr(record, field, value)
            record.save()

            return Response({'id': record.id, **result})
        except Exception as e:
            record.delete()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ATSHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = ATSAnalysis.objects.filter(analyzed_by=request.user).order_by('-created_at')[:20]
        return Response(ATSAnalysisSerializer(records, many=True).data)


class ATSJobRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .ats_service import JOB_KEYWORDS
        return Response(list(JOB_KEYWORDS.keys()))
