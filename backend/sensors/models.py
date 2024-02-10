from django.db import models
from enum import Enum


###############
### READING ###
###############
class SensorReading(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    level = models.FloatField()
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE, related_name='readings')
    
    def __str__(self):
        return f"Timestamp: {self.timestamp} Sensor: {self.sensor.token}"


###########
### LOG ###
###########
class SensorStatus(Enum):
    NORMAL = 'Normal', 'Normal'
    WARNING = 'Warning', 'Warning'
    ERROR = 'Error', 'Error'

class SensorLog(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=25, choices=SensorStatus.choices, default=SensorStatus.NORMAL)
    signal_strength = models.IntegerField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    is_error = models.BooleanField(default=False)
    error_message = models.TextField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE, related_name='logs')

    def __str__(self):
        return f"Timestamp: {self.timestamp} Sensor: {self.sensor.token} Status: {self.status}"
