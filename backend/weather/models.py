from django.db import models
from django.utils import timezone

class CurrentWeatherData(models.Model):
    """
    Model to store the current weather data for a city.
    """
    
    city_name = models.CharField(max_length=255)
    lon = models.FloatField(help_text="Longitude of the city.")
    lat = models.FloatField(help_text="Latitude of the city.")
    weather_main = models.CharField(max_length=255, help_text="Main weather condition.")
    weather_description = models.CharField(max_length=255, help_text="Description of the weather condition.")
    temperature = models.FloatField(help_text="Current temperature in Celsius.")
    feels_like = models.FloatField(help_text="Feels like temperature in Celsius.")
    temp_min = models.FloatField(help_text="Minimum temperature in the current weather data.")
    temp_max = models.FloatField(help_text="Maximum temperature in the current weather data.")
    pressure = models.IntegerField(help_text="Atmospheric pressure in hPa.")
    humidity = models.IntegerField(help_text="Humidity percentage.")
    wind_speed = models.FloatField(help_text="Wind speed in meters per second.")
    wind_deg = models.IntegerField(help_text="Wind direction in degrees.")
    timestamp = models.DateTimeField(auto_now=True, help_text="Timestamp of the weather data update.")

    class Meta:
        unique_together = ('city_name',)
        verbose_name = 'Current Weather Data'
        verbose_name_plural = 'Current Weather Data'

    def __str__(self):
        return f"{self.city_name} - {self.weather_main}"


class DailyWeatherData(models.Model):
    """
    Model to store daily weather data for a city.
    """
    
    city_name = models.CharField(max_length=255)
    lon = models.FloatField(help_text="Longitude of the city.")
    lat = models.FloatField(help_text="Latitude of the city.")
    date = models.DateField(help_text="Date of the weather data.")
    weather_main = models.CharField(max_length=255, help_text="Main weather condition.")
    weather_description = models.CharField(max_length=255, help_text="Description of the weather condition.")
    temperature = models.FloatField(help_text="Temperature in Celsius for the day.")
    feels_like = models.FloatField(help_text="Feels like temperature in Celsius for the day.")
    temp_min = models.FloatField(help_text="Minimum temperature for the day.")
    temp_max = models.FloatField(help_text="Maximum temperature for the day.")
    pressure = models.IntegerField(help_text="Atmospheric pressure in hPa for the day.")
    humidity = models.IntegerField(help_text="Humidity percentage for the day.")
    wind_speed = models.FloatField(help_text="Average wind speed in meters per second for the day.")
    wind_deg = models.IntegerField(help_text="Average wind direction in degrees for the day.")
    timestamp = models.DateTimeField(default=timezone.now, help_text="Timestamp of the daily weather data entry.")

    class Meta:
        unique_together = ('city_name', 'date')
        verbose_name = 'Daily Weather Data'
        verbose_name_plural = 'Daily Weather Data'

    def __str__(self):
        return f"{self.city_name} - {self.date}"
