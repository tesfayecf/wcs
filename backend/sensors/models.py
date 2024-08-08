from django.db import models
from timescale.db.models.models import TimescaleModel
from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from django.utils.timezone import now

class TimescaleModel(models.Model):
    """
    A helper class for using Timescale within Django.
    Includes TimescaleManager and TimescaleDateTimeField.
    This is an abstract class and should be inherited by other classes for use.
    """
    time = TimescaleDateTimeField(interval="1 day", default=now)  # Setting interval to "1 day" for time-series data
    objects = models.Manager()  # Default manager
    timescale = TimescaleManager()  # TimescaleDB-specific manager

    class Meta:
        abstract = True

###############
### READING ###
###############

class SensorReading(TimescaleModel):
    distance = models.FloatField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE, related_name='readings')
    
    class Meta:
        verbose_name = "Sensor Reading"
        verbose_name_plural = "Sensor Readings"
        ordering = ['-time']  # Ordering by time in descending order for recent readings first

    def __str__(self):
        return f"SensorReading(id={self.id}, distance={self.distance}, time={self.time})"

###########
### LOG ###
###########

class SensorStatus(models.TextChoices):
    INFO = 'INFO', 'Info'
    WARNING = 'WARNING', 'Warning'
    ERROR = 'ERROR', 'Error'

class SensorLog(TimescaleModel):
    status = models.CharField(max_length=25, choices=SensorStatus.choices, default=SensorStatus.INFO)
    status_message = models.TextField(null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    battery_percentage = models.IntegerField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE, related_name='logs')

    class Meta:
        verbose_name = "Sensor Log"
        verbose_name_plural = "Sensor Logs"
        ordering = ['-time']  # Ordering by time in descending order for recent logs first

    def __str__(self):
        return f"SensorLog(id={self.id}, sensor={self.sensor}, status={self.status}, time={self.time})"
