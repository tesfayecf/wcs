from django.contrib import admin
from .models import Sensor, SensorData, TankSensor

# Register your models here.
admin.site.register(Sensor)
admin.site.register(TankSensor)
admin.site.register(SensorData)