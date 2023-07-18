from django.db import models

# Create your models here.

class TankGroup(models.Model):
    # Model representing a group of tanks
    name = models.CharField(max_length=50)
    location = models.TextField()
    isActive = models.BooleanField()

    def __str__(self):
        return self.name


class Tank(models.Model):
    # Model representing a single tank
    name = models.CharField(max_length=50)
    type_choices = [
        ("Storage", "Storage"), 
        ("Well", "Well"),
        ("Reservoir", "Reservoir"),
        ("Tank", "Tank"),
        ("Other", "Other")
    ]
    type = models.CharField(max_length=50, choices=type_choices)
    capacity = models.PositiveIntegerField()
    is_active = models.BooleanField()
    dimensions = models.CharField(max_length=100)
    material = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    tankGroup = models.ForeignKey(TankGroup, on_delete=models.CASCADE, related_name='tanks')

    def __str__(self):
        return self.name



