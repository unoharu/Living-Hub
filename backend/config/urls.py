"""
Root URL configuration.

Routes:
  /admin/          → Django Admin (server-rendered)
  /api/v1/...      → DRF REST API
  everything else  → React SPA (index.html fallback)
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/accounts/", include("apps.accounts.urls")),
    path("api/v1/properties/", include("apps.properties.urls")),
    path("api/v1/interactions/", include("apps.interactions.urls")),
    path("api/v1/inquiries/", include("apps.inquiries.urls")),
    path("api/v1/bulletin/", include("apps.bulletin.urls")),
    # SPA fallback: any path not starting with api/, admin/, or media/
    re_path(
        r"^(?!api/|admin/|media/).*$",
        TemplateView.as_view(template_name="index.html"),
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
