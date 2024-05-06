from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include
from . import settings
from django.contrib.staticfiles.urls import static

urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('index.urls')),
    path('accounts/', include('accounts.urls')),
    path('stores/', include('stores.urls')),
    path('like/', include('like.urls')),
    path('dashboard/', include('dashboard.urls')),
    prefix_default_language=False,
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
