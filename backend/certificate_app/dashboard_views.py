from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import Certificate


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = Certificate.objects.count()
        active = Certificate.objects.filter(status='active').count()
        this_month = Certificate.objects.filter(
            created_at__month=timezone.now().month,
            created_at__year=timezone.now().year
        ).count()

        return Response({
            'total_certificates': total,
            'active': active,
            'revoked': total - active,
            'this_month': this_month,
        })


class MonthlyDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models.functions import TruncMonth
        import datetime

        data = (
            Certificate.objects
            .filter(created_at__year=timezone.now().year)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        return Response([{
            'month': row['month'].strftime('%b'),
            'certificates': row['count']
        } for row in data])


class RecentActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recent = Certificate.objects.select_related('generated_by').order_by('-created_at')[:10]
        return Response([{
            'id': c.id,
            'cert_code': c.cert_code,
            'name': c.name,
            'cert_type': c.cert_type,
            'department': c.department,
            'status': c.status,
            'generated_by': c.generated_by.username if c.generated_by else '—',
            'created_at': c.created_at,
        } for c in recent])
