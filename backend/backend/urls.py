from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    
    path("auth/", include('users.urls')),
    path("api/", include("tanks.urls")),
    path("mqtt/", include('sensors.urls')),
    
    path("auth/", include('djoser.urls')),
] 