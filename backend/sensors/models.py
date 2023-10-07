import uuid
from django.db import models

class Sensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    serial_number = models.CharField(max_length=50, unique=True)
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    installation_date = models.DateField()
    calibration_date = models.DateField()
    maintenance_interval = models.DurationField(null=True, blank=True)

    def __str__(self):
        return f"{self.serial_number}"

class TankSensor(models.Model):
    # Table used to make the relations between a sensor and a tank.
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='tank_sensor')
    tank = models.ForeignKey("tanks.Tank", on_delete=models.CASCADE, related_name='tank_sensor')
    is_active = models.BooleanField(default=True)
    # Add more fields as needed
    def __str__(self):
        return f"Sensor: {self.sensor.serial_number}, Tank: {self.tank.name}"

class SensorData(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    time = models.DateTimeField(primary_key=True, auto_now=True)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='sensor_data')
    water_level = models.FloatField()
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    is_alert = models.BooleanField(default=False)
    alert_message = models.TextField(null=True, blank=True)
    # Additional telemetry data fields
    pressure = models.FloatField(null=True, blank=True)
    wind_speed = models.FloatField(null=True, blank=True)
    wind_direction = models.FloatField(null=True, blank=True)
    rain_rate = models.FloatField(null=True, blank=True)
    soil_moisture = models.FloatField(null=True, blank=True)
    air_quality = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Timestamp: {self.timestamp} Water Level: {self.water_level} Sensor: {self.sensor.serial_number}, "
