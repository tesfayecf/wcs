
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    
    path("", include("tanks.urls")),
    path("api/", include('users.urls')),
    
    path("api/", include('djoser.urls')),

    path("mqtt/", include('sensors.urls'))
]
