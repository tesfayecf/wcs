from rest_framework import serializers
from datetime import datetime

###############
### CURRENT ###
###############

class GetCurrentWeatherSerializer(serializers.Serializer):
    city_name = serializers.CharField()

class WeatherDescriptionSerializer(serializers.Serializer):
    main = serializers.CharField()
    description = serializers.CharField()

class WeatherDetailsSerializer(serializers.Serializer):
    temp = serializers.FloatField()
    feels_like = serializers.FloatField()
    temp_min = serializers.FloatField()
    temp_max = serializers.FloatField()
    pressure = serializers.IntegerField()
    humidity = serializers.IntegerField()

class WeatherWindSerializer(serializers.Serializer):
    speed = serializers.FloatField()
    deg = serializers.IntegerField()

class WeatherCoordSerializer(serializers.Serializer):
    lon = serializers.FloatField()
    lat = serializers.FloatField()

class CurrentWeatherSerializer(serializers.Serializer):
    city_name = serializers.CharField()
    coord = WeatherCoordSerializer()
    weather = WeatherDescriptionSerializer(many=True)
    main = WeatherDetailsSerializer()
    wind = WeatherWindSerializer()
    timestamp = serializers.DateTimeField()

################
### FORECAST ###
################

class GetForecastWeatherSerializer(serializers.Serializer):
    city_name = serializers.CharField()

class ForecastWeatherSerializer(serializers.Serializer):
    temp = serializers.FloatField()
    feels_like = serializers.FloatField()
    temp_min = serializers.FloatField()
    temp_max = serializers.FloatField()
    pressure = serializers.IntegerField()
    humidity = serializers.IntegerField()
    weather_main = serializers.CharField()
    weather_description = serializers.CharField()
    wind_speed = serializers.FloatField()
    wind_deg = serializers.IntegerField()

class ForecastWeatherSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    description = serializers.CharField()
    icon = serializers.CharField()
    temperature = serializers.DictField(child=serializers.FloatField())
    wind = serializers.FloatField()
    humidity = serializers.IntegerField()


###################
### COORDINATES ###
###################

class GetWeatherByCoordinatesSerializer(serializers.Serializer):
    lat = serializers.FloatField(required=True, help_text="Latitude of the location.")
    lon = serializers.FloatField(required=True, help_text="Longitude of the location.")