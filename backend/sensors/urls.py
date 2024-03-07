from django.urls import path
from .views import *

urlpatterns = [
    # sensor readings
    path('sensor-readings/', GetSensorReadingsView.as_view()),
    path('sensor-stats/', GetNetFlowView.as_view()),
]
