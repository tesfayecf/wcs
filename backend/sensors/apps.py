from django.apps import AppConfig
from backend.utils.mqttManager import MqttManager
class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    def ready(self):
        print("sensors app ready")
        # mqqtManager = MqttManager()
        # mqqtManager.subscribe("a", "test")
