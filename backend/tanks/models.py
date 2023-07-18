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
    # Model representing a single water tank
    name = models.CharField(max_length=50)
    capacity = models.PositiveIntegerField()
    isActive = models.BooleanField()

    x = models.IntegerField()
    y = models.IntegerField()
    z = models.IntegerField()
    material = models.TextField()
    brandName = models.TextField()

    tankGroup = models.ForeignKey(TankGroup,on_delete=models.CASCADE, default=0)

    def __str__(self):
        return self.name


