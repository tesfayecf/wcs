import uuid
from django.db import models

class Sensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=50, unique=True)
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    installation_date = models.DateField()
    calibration_date = models.DateField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    elevation = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    maintenance_interval = models.DurationField(null=True, blank=True)
    tank = models.OneToOneField("tanks.Tank", on_delete=models.CASCADE)
    # Add more fields as needed

    def __str__(self):
        return self.name
    
class SensorData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='sensor_data')
    timestamp = models.DateTimeField()
    water_level = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
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
    # Add more fields as needed

    def __str__(self):
        return f"Sensor: {self.sensor.name}, Timestamp: {self.timestamp}"