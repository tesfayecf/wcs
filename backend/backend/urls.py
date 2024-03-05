from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/auth/", include('users.urls')),
    path("api/data/", include("data.urls")),
    path("api/sensors/", include("sensors.urls")),
] 