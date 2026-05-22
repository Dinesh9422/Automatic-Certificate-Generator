from django.urls import path
from .views import ATSAnalyzeView, ATSHistoryView, ATSJobRolesView

urlpatterns = [
    path('analyze/',   ATSAnalyzeView.as_view(),   name='ats-analyze'),
    path('history/',   ATSHistoryView.as_view(),   name='ats-history'),
    path('job-roles/', ATSJobRolesView.as_view(),  name='ats-job-roles'),
]
