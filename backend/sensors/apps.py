from django.apps import AppConfig
from utils.mqttManager import MqttManager
class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    def ready(self):
        mqttmanger = MqttManager().connect()