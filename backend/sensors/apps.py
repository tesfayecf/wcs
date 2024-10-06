from django.apps import AppConfig
from django.dispatch import Signal

# Define a custom signal for app loaded
sensors_app_loaded = Signal()

class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    def ready(self):
        from mqtt.server import start_mqtt_server
        
        if not getattr(self, 'server_started', False):
            # Emit the custom signal when the app is ready
            sensors_app_loaded.connect(start_mqtt_server)
            sensors_app_loaded.send(sender=self)
            self.server_started = True