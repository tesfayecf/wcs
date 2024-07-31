from django.db import models
from django.utils import timezone

class CurrentWeatherData(models.Model):
    city_name = models.CharField(max_length=255)
    lon = models.FloatField()
    lat = models.FloatField()
    weather_main = models.CharField(max_length=255)
    weather_description = models.CharField(max_length=255)
    temperature = models.FloatField()
    feels_like = models.FloatField()
    temp_min = models.FloatField()
    temp_max = models.FloatField()
    pressure = models.IntegerField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    wind_deg = models.IntegerField()
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.city_name} - {self.weather_main}"


class DailyWeatherData(models.Model):
    city_name = models.CharField(max_length=255)
    lon = models.FloatField()
    lat = models.FloatField()
    date = models.DateField()
    weather_main = models.CharField(max_length=255)
    weather_description = models.CharField(max_length=255)
    temperature = models.FloatField()
    feels_like = models.FloatField()
    temp_min = models.FloatField()
    temp_max = models.FloatField()
    pressure = models.IntegerField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    wind_deg = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('city_name', 'date')

    def __str__(self):
        return f"{self.city_name} - {self.date}"
