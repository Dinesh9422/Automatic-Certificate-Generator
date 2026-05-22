from django.urls import path
from .dashboard_views import DashboardStatsView, MonthlyDataView, RecentActivityView

urlpatterns = [
    path('stats/',    DashboardStatsView.as_view(),   name='dashboard-stats'),
    path('monthly/',  MonthlyDataView.as_view(),       name='dashboard-monthly'),
    path('activity/', RecentActivityView.as_view(),    name='dashboard-activity'),
]
