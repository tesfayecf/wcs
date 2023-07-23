# urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('subscribe/', views.subscribe_sensor, name='subscribe_sensor'),
]
