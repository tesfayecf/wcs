from django.db import models
from sensors.models import SensorData
from django.db.models import Avg, Max, Min
from django.utils import timezone

class TankGroup(models.Model):
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

    def total_active_tanks(self):
        return self.tanks.filter(is_active=True).count()

    def total_sensor_data(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).count()

    def average_water_level(self):
        total_data = SensorData.objects.filter(sensor__tank__tankGroup=self).count()
        if total_data > 0:
            sum_water_level = SensorData.objects.filter(sensor__tank__tankGroup=self).aggregate(models.Sum('water_level'))['water_level__sum']
            return sum_water_level / total_data
        return 0.0

    def get_latest_sensor_data(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).latest('timestamp')

    def get_oldest_sensor_data(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).earliest('timestamp')

    @property
    def min_water_level(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).aggregate(Min('water_level'))['water_level__min']

    @property
    def max_water_level(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).aggregate(Max('water_level'))['water_level__max']

    @property
    def average_temperature(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self).aggregate(Avg('temperature_celsius'))['temperature_celsius__avg']

    @property
    def total_low_water_alerts(self):
        return SensorData.objects.filter(sensor__tank__tankGroup=self, is_alert=True).count()

    def get_sensor_data_between_dates(self, start_date, end_date):
        return SensorData.objects.filter(sensor__tank__tankGroup=self, timestamp__gte=start_date, timestamp__lte=end_date)





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
    is_active = models.BooleanField(default=True)
    dimensions = models.CharField(max_length=100)
    material = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    tankGroup = models.ForeignKey(TankGroup, on_delete=models.CASCADE, related_name='tanks')
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name

    def total_sensors(self):
        return self.sensors.count()

    def total_active_sensors(self):
        return self.sensors.filter(sensor_data__isnull=False).distinct().count()

    @property
    def average_water_level(self):
        return self.sensors.aggregate(Avg('sensor_data__water_level'))['sensor_data__water_level__avg']

    @property
    def min_water_level(self):
        return self.sensors.aggregate(Min('sensor_data__water_level'))['sensor_data__water_level__min']

    @property
    def max_water_level(self):
        return self.sensors.aggregate(Max('sensor_data__water_level'))['sensor_data__water_level__max']

    def get_latest_sensor_data(self):
        return SensorData.objects.filter(sensor__tank=self).latest('timestamp')

    def get_oldest_sensor_data(self):
        return SensorData.objects.filter(sensor__tank=self).earliest('timestamp')
