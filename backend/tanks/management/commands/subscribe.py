from django.core.management.base import BaseCommand, CommandError
from utils.mqttManager import MqttManager
from sensors.models import TankSensor


class Command(BaseCommand):
    help = 'Subscribe to MQTT topics'

    def handle(self, *args, **options):
        try:
            mqqtManager = MqttManager()
            tankSensorRelation = TankSensor.objects.all()
            for tankSensor in tankSensorRelation:
                mqqtManager.subscribe(tankSensor.sensor.serial_number + "/data")
                mqqtManager.subscribe(tankSensor.sensor.serial_number + "/status")
                mqqtManager.subscribe(tankSensor.sensor.serial_number + "/config")
        except Exception as e:
            raise CommandError(e)

