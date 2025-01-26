from django.db import models
from timescale.db.models.models import TimescaleModel
from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
from django.utils.timezone import now

from resources.models import Sensor

###############
### MEASURE ###
###############

class MeasureType(models.TextChoices):
    TEMPERATURE = 'Temperature', 'Temperature'
    PRESSURE = 'Pressure', 'Pressure'
    LEVEL = 'Level', 'Level'
    COUNTER = 'Counter', 'Counter'
    VIBRATION = 'Vibration', 'Vibration'
    SPEED = 'Speed', 'Speed'
    OTHER = 'Other', 'Other'

class Measure(models.Model):
    label = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=100, choices=MeasureType.choices, default=MeasureType.LEVEL)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='measures', db_index=True)

    class Meta:
        unique_together = ['label', 'sensor']
        verbose_name = 'Measure'
        verbose_name_plural = 'Measures'

    def __str__(self):
        return f"{self.name} ({self.label})"

###############
### CHANNEL ###
###############

class Channel(models.Model):
    label = models.CharField(max_length=50)
    version = models.CharField(max_length=20)
    unit = models.CharField(max_length=20)
    rate = models.FloatField()
    measure = models.ForeignKey(Measure, on_delete=models.CASCADE, related_name='channels', db_index=True)

    class Meta:
        verbose_name = 'Channel'
        verbose_name_plural = 'Channels'

    def __str__(self):
        return f"{self.label} ({self.unit})"


#############
### CHUNK ###
#############

class Chunk(models.Model):
    measure = models.ForeignKey(Measure, on_delete=models.CASCADE, related_name='chunks', db_index=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        verbose_name = 'Chunk'
        verbose_name_plural = 'Chunks'

    def __str__(self):
        return f"{self.measure.label}: {self.start_time} - {self.end_time}"

##############
### RECORD ###
##############

class Record(TimescaleModel):
    time = TimescaleDateTimeField(interval="1 hour", default=now)
    value = models.FloatField()
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='records', db_index=True)
    chunk = models.ForeignKey(Chunk, on_delete=models.CASCADE, related_name='records', db_index=True)

    class Meta:
        verbose_name = 'Record'
        verbose_name_plural = 'Records'

    def __str__(self):
        return f"Record(id={self.id}, value={self.value})"

"""

Sensor: 
This model represents a source of measurements. Each sensor has a unique ID (primary key), name, device_id, status, 
description (optional), and a timestamp indicating when it was created. A sensor can have multiple measures.

Measure: 
The Measure model represents a specific type of measurement made by a sensor. Each measure has a label (slug field), name, 
description (optional), type (choices include Temperature, Pressure, Level, Counter, Vibration, Speed, and Other), and a reference to 
its sensor. The combination of label and sensor must be unique. A sensor can have multiple measures.

Channel: 
This model represents a specific data channel of a measure. Each channel has a label (slug field), version, unit of measurement, 
sampling rate, and a reference to its measure. The combination of label and measure must be unique. A measure can have multiple channels.

Chunk: 
The Chunk model represents a specific time period of data for a measure. Each chunk has a reference to its measure, a start time, 
and an end time. A measure can have multiple chunks, allowing for efficient data segmentation and retrieval.

Record: 
This model represents individual data points in the time series. Each record has a timestamp, a value (float), and references to 
its associated channel and chunk. The combination of timestamp, channel, and chunk must be unique. It inherits from TimescaleModel for time-series optimizations, designed for high-performance time-series data storage and retrieval.

"""