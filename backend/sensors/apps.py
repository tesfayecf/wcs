from django.apps import AppConfig
from utils.mqttManager import MqttManager

class SensorsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sensors"
    # def ready(self):
    #     try:
    #         from sensors.models import TankSensor

    #         # mqqtManager = MqttManager()
    #         # tankSensorRelation = TankSensor.objects.all()
    #         # for tankSensor in tankSensorRelation:
    #         #     mqqtManager.subscribe(tankSensor.sensor.serial_number + "/data")
    #         #     mqqtManager.subscribe(tankSensor.sensor.serial_number + "/status")
    #         #     mqqtManager.subscribe(tankSensor.sensor.serial_number + "/config")
    #     except Exception as e:
    #         raise (e)
