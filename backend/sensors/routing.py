from django.urls import path
from sensors.consumers import SensorDataConsumer

websocket_urlpatterns = [
    # Define the WebSocket path and the associated consumer
    path('ws/sensor_data/', SensorDataConsumer.as_asgi()),
]
