from django.apps import AppConfig

class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    def ready(self):
        from sensors.MQTT.connect import connect
        connect()