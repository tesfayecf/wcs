from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/auth/", include('users.urls')),
    
    path("api/", include("tanks.urls")),
    
    path("api/mqtt/", include('sensors.urls')),
    
] 