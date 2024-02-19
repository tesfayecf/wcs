from django.db import models

from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from django.utils.timezone import now


class TimescaleModel(models.Model):
    """
    A helper class for using Timescale within Django, has the TimescaleManager and
    TimescaleDateTimeField already present. This is an abstract class it should
    be inheritted by another class for use.
    """
    time = TimescaleDateTimeField(interval="1 minute",default=now) # 1 minute
    objects = TimescaleManager()

    class Meta:
        abstract = True


# ###############
# ### READING ###
# ###############
class SensorReading(TimescaleModel):
    level = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    sensor_id = models.IntegerField(default=-1)
    
    def __str__(self):
        return f"Sensor: {self.sensor_id} "


# ###########
# ### LOG ###
# ###########
class SensorStatus(models.TextChoices):
    NORMAL = ('Normal', 'Normal')
    WARNING = ('Warning', 'Warning')
    ERROR = ('Error', 'Error')

class SensorLog(TimescaleModel):
    status = models.CharField(max_length=25, choices=SensorStatus.choices, default=SensorStatus.NORMAL)
    status_message = models.TextField(null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    battery_percentage = models.IntegerField(null=True, blank=True)
    sensor_id = models.IntegerField(default=-1)

    def __str__(self):
        return f"Sensor: {self.sensor_id} Status: {self.status}"
