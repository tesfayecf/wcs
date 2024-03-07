from django.db import models
from timescale.db.models.models import TimescaleModel

from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from django.utils.timezone import now


class TimescaleModel(models.Model):
    """
    A helper class for using Timescale within Django, has the TimescaleManager and
    TimescaleDateTimeField already present. This is an abstract class it should
    be inheritted by another class for use.
    """
    time = TimescaleDateTimeField(interval="1 day", default=now) # 1 minute
    objects = models.Manager()
    timescale = TimescaleManager()

    class Meta:
        abstract = True


###############
### READING ###
###############
class SensorReading(TimescaleModel):
    distance = models.FloatField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Sensor: {self.sensor} Distance: {self.distance} "


###########
### LOG ###
###########
class SensorStatus(models.TextChoices):
    INFO = ('Info', 'Info')
    WARNING = ('Warning', 'Warning')
    ERROR = ('Error', 'Error')

class SensorLog(TimescaleModel):
    status = models.CharField(max_length=25, choices=SensorStatus.choices, default=SensorStatus.INFO)
    status_message = models.TextField(null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    battery_percentage = models.IntegerField(null=True, blank=True)
    sensor = models.ForeignKey('data.Sensor', on_delete=models.CASCADE)

    def __str__(self):
        return f"Sensor: {self.sensor} Status: {self.status}"
