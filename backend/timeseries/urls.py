from django.urls import path
from .views import *

urlpatterns = [
    # sensor readings
    path('readings/', GetSensorReadingsView.as_view()),
    path('last-reading/', GetSensorLastReadingView.as_view()),
    path('flow/', GetSensorFlowView.as_view()),
    # path('stats/', GetSensorStatsView.as_view()),
]
