from django.db import models

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    'created' and 'modified' fields.
    """
    date_created = models.DateTimeField(('date created'), auto_now_add=True)
    date_modified = models.DateTimeField(('date modified'), auto_now=True)

    class Meta:
        abstract = True

#############
### GROUP ###
#############

class Group(TimeStampedModel):
    """
    Model representing a group of tanks.
    """
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey("users.UserAccount", on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.name
    
    def total_tanks(self):
        return self.tanks.count()
    
    def total_active_tanks(self):
        return self.tanks.filter(is_active=True).count()
    
    def total_capacity(self):
        return sum(tank.capacity for tank in self.tanks.all())
    
    def total_active_capacity(self):
        return sum(tank.capacity for tank in self.tanks.filter(is_active=True))
    
    def total_sensors(self):
        return sum(tank.sensor.count() for tank in self.tanks.all())
    
    def total_active_sensors(self):
        return sum(tank.sensor.filter(is_active=True).count() for tank in self.tanks.filter(is_active=True))


############
### TANK ###
############

class TankType(models.TextChoices):
    STORAGE = ('Storage', 'Storage')
    WELL = ('Well', 'Well')
    RESERVOIR = ('Reservoir', 'Reservoir')
    TANK = ('Tank', 'Tank')
    OTHER = ('Other', 'Other')

class Tank(TimeStampedModel):
    # Model representing a single tank
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=25, choices=TankType.choices, default=TankType.STORAGE)
    capacity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='tanks')

    def __str__(self):
        return self.name


##############
### SENSOR ###
##############
class Sensor(TimeStampedModel):
    sensor_id = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    tank = models.OneToOneField(Tank, on_delete=models.CASCADE, related_name='sensor')

    def __str__(self):
        return f"{self.sensor_id}"