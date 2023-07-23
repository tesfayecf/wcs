# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from backend.backend.utils.mqttManager import MqttManager

@csrf_exempt  # Disable CSRF protection for simplicity. Handle CSRF in production.
def subscribe_sensor(request):
    if request.method == 'POST':
        sensor_id = request.POST.get('sensor_id')
        topic = request.POST.get('topic')

        # Subscribe the sensor to the specified MQTT topic
        # mqtt_manager = MqttManager()
        # mqtt_manager.subscribe(sensor_id, topic)

        return JsonResponse({'message': f'Sensor {sensor_id} subscribed to topic {topic}'})
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)
