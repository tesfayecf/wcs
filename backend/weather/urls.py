from django.urls import path
from .views import *

urlpatterns = [
    path("current/", GetCurrentWeatherView.as_view()),
    path("forecast/", GetForecastWeatherView.as_view()),
]
