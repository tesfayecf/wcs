
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    
    path("api/", include("tanks.urls")),
    path("auth/", include('users.urls')),
    path("mqtt/", include('sensors.urls')),
    
    path("api/", include('djoser.urls')),
]
