
from django.contrib import admin
from django.urls import path, include
from channels.routing import ProtocolTypeRouter, URLRouter

urlpatterns = [
    path("admin/", admin.site.urls),
    
    path("", include("tanks.urls")),
    path("api/", include('users.urls')),
    
    path("api/", include('djoser.urls')),
]
