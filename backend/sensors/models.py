import uuid
from django.db import models
from django.utils import timezone

class Sensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sensor_id = models.CharField(max_length=50, unique=True)
    first_start = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    last_start = models.DateTimeField(null=True, blank=True)
    secret_key = models.CharField(max_length=50, unique=True)

    def start(self, *args, **kwargs):
        # Set first_start when the sensor is created
        if not self.pk:
            self.first_start = timezone.now()

        # Update last_start every time the sensor is saved
        self.last_start = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sensor_id}"

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
    level = models.FloatField()
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
