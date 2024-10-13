from django.db import models
from users.models import User

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    'edited_at' and 'edited_at' fields.
    """
    edited_at = models.DateTimeField('edition date', auto_now=True)
    created_at = models.DateTimeField('creation date', auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']  # Orders by creation date descending by default
        get_latest_by = 'created_at'  # Useful for retrieving the latest created object

#############
### GROUP ###
#############

class Group(TimeStampedModel):
    """
    Model representing a group of tanks.
    """
    name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, db_index=True)
    
    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'
        ordering = ['name']  # Orders groups by name ascending
        unique_together = ['name', 'user'] # Ensures that a group with the same name and user can exits

    def __str__(self):
        return self.name

############
### TANK ###
############

class TankType(models.TextChoices):
    STORAGE = 'Storage', 'Storage'
    WELL = 'Well', 'Well'
    RESERVOIR = 'Reservoir', 'Reservoir'
    TANK = 'Tank', 'Tank'
    OTHER = 'Other', 'Other'

class Tank(TimeStampedModel):
    """
    Model representing a single tank.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=255, choices=TankType.choices, default=TankType.STORAGE)
    capacity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='tanks', db_index=True)

    class Meta:
        verbose_name = 'Tank'
        verbose_name_plural = 'Tanks'
        ordering = ['name']  # Orders tanks by name ascending
        unique_together = ['name', 'group']  # Ensures tanks have unique names within a group

    def __str__(self):
        return self.name

##############
### SENSOR ###
##############

class SensorStatus(models.TextChoices):
    IDLE = 'Idle', 'Idle'
    CONNECTING = 'Connecting', 'Connecting'
    CONNECTED = 'Connected', 'Connected'
    DISCONNECTING = 'Disconnecting', 'Disconnecting'
    DISCONNECTED = 'Disconnected', 'Disconnected'
    ERROR = 'Error', 'Error'

class Sensor(TimeStampedModel):
    """
    Model representing a sensor attached to a tank.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    device_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, choices=SensorStatus.choices, default=SensorStatus.IDLE)
    installation_date = models.DateField(null=True, blank=True)
    maintenance_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='sensor', db_index=True)

    class Meta:
        verbose_name = 'Sensor'
        verbose_name_plural = 'Sensors'
        ordering = ['device_id']
        unique_together = ['name', 'tank']

    def __str__(self):
        return f"{self.device_id}"
