from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/users/", include('users.urls')),
    path("api/data/", include("data.urls")),
    path("api/weather/", include("weather.urls")),
    path("api/sensors/", include("timeseries.urls")),
] 