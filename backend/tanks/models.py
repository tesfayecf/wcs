from django.db import models
from sensors.models import SensorData
from django.db.models import Avg, Max, Min
from django.utils import timezone

class Group(models.Model):
    # Model representing a group of tanks
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    user = models.ForeignKey("users.UserAccount", on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.name

    def total_tanks(self):
        return self.tanks.count()

    def get_total_capacity(self):
        return self.tanks.aggregate(models.Sum('capacity'))['capacity__sum']


class Tank(models.Model):
    # Model representing a single tank
    name = models.CharField(max_length=100)
    type_choices = [
        ("Storage", "Storage"),
        ("Well", "Well"),
        ("Reservoir", "Reservoir"),
        ("Tank", "Tank"),
        ("Other", "Other")
    ]
    type = models.CharField(max_length=50, choices=type_choices)
    capacity = models.PositiveIntegerField()
    isActive = models.BooleanField(default=True)
    dimensions = models.CharField(max_length=100)
    material = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='tanks')

    def __str__(self):
        return self.name
    
    def has_sensor_assigned(self):
        # Check if there's a related TankSensor record for this tank
        return self.tank_sensor.filter(is_active=True).exists()