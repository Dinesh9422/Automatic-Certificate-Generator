from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/', include('users.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Core modules
    path('api/certificates/', include('certificate_app.urls')),
    path('api/ocr/',          include('ocr_app.urls')),
    path('api/ats/',          include('ats_app.urls')),
    path('api/qr/',           include('qr_app.urls')),

    # Dashboard stats (served by certificate_app)
    path('api/dashboard/',    include('certificate_app.dashboard_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
