from django.apps import AppConfig
from utils.mqttManager import MqttManager

class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    def ready(self):
        # Initialize the MQTT manager singleton
        mqqtManager = MqttManager()
        # Start broker connection
        mqqtManager.start()
        # Set basic topics
        mqqtManager.setBasicTopics()