import random
import requests
from datetime import timedelta, datetime
from typing import Dict, Any, List
from pydantic import ValidationError

from django.utils import timezone
from django.core.cache import cache
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .client import WeatherAPIClient
from .models import CurrentWeatherData, DailyWeatherData
from utils.misc import _get_seconds_until_next_hour

api_client = WeatherAPIClient()

class GetCurrentWeatherView(APIView):
    def post(self, request):
        try:
            # Get city from user info
            user = request.user
            city_name = random.choice(["girona", "barcelona", "madrid", "valencia"])

            # Try to get data from cache first
            cache_key = f"current_weather_{city_name}"
            cached_data = cache.get(cache_key)
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            # Check if recent weather data exists in the database
            weather_data = CurrentWeatherData.objects.filter(city_name=city_name).first()
            if weather_data and (timezone.now() - weather_data.timestamp) < timedelta(hours=1):
                response_data = self._format_current_weather_response(weather_data)
                cache_timeout = _get_seconds_until_next_hour()
                cache.set(cache_key, response_data, timeout=cache_timeout)
                return Response(response_data, status=status.HTTP_200_OK)

            # Fetch new data from API
            weather_data_json = api_client.get_current_weather(city_name)

            # Update or create weather data in the database
            weather_data = self._update_or_create_current_weather_data(city_name, weather_data_json)
            
            response_data = self._format_current_weather_response(weather_data)
            cache_timeout = _get_seconds_until_next_hour()
            cache.set(cache_key, response_data, timeout=cache_timeout)
            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException as e:
            return Response({"error": f"API request failed: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _update_or_create_current_weather_data(self, city_name: str, weather_data_json: Dict[str, Any]) -> CurrentWeatherData:
        """Update or create CurrentWeatherData instance from API response."""
        weather_data, _ = CurrentWeatherData.objects.update_or_create(
            city_name=city_name,
            defaults={
                "lon": weather_data_json['coord']['lon'],
                "lat": weather_data_json['coord']['lat'],
                "weather_main": weather_data_json['weather'][0]['main'],
                "weather_description": weather_data_json['weather'][0]['description'],
                "temperature": weather_data_json['main']['temp'],
                "feels_like": weather_data_json['main']['feels_like'],
                "temp_min": weather_data_json['main']['temp_min'],
                "temp_max": weather_data_json['main']['temp_max'],
                "pressure": weather_data_json['main']['pressure'],
                "humidity": weather_data_json['main']['humidity'],
                "wind_speed": weather_data_json['wind']['speed'],
                "wind_deg": weather_data_json['wind']['deg'],
                "timestamp": timezone.now()
            }
        )
        return weather_data

    def _format_current_weather_response(self, weather_data: CurrentWeatherData) -> Dict[str, Any]:
        """Format CurrentWeatherData instance for API response."""
        return {
            "city_name": weather_data.city_name,
            "coord": {"lon": weather_data.lon, "lat": weather_data.lat},
            "weather": [{
                "main": weather_data.weather_main,
                "description": weather_data.weather_description
            }],
            "main": {
                "temp": weather_data.temperature,
                "feels_like": weather_data.feels_like,
                "temp_min": weather_data.temp_min,
                "temp_max": weather_data.temp_max,
                "pressure": weather_data.pressure,
                "humidity": weather_data.humidity
            },
            "wind": {
                "speed": weather_data.wind_speed,
                "deg": weather_data.wind_deg
            },
            "timestamp": weather_data.timestamp
        }

class GetForecastWeatherView(APIView):
    def post(self, request):
        try:
            user = request.user
            city_name = random.choice(["girona", "barcelona", "madrid", "valencia"])

            cache_key = f"forecast_weather_{city_name}"
            cached_data = cache.get(cache_key)
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            today = timezone.now().date()
            next_five_days = [today + timedelta(days=i) for i in range(5)]

            if settings.DEBUG:
                existing_data = DailyWeatherData.objects.filter(city_name=city_name).order_by('date')
            else:
                existing_data = DailyWeatherData.objects.filter(city_name=city_name, date__in=next_five_days)

            if existing_data.count() == 5:
                response_data = [self._format_weather_data(entry) for entry in existing_data]
                cache_timeout = _get_seconds_until_next_hour()
                cache.set(cache_key, response_data, timeout=cache_timeout)
                return Response(response_data, status=status.HTTP_200_OK)

            forecast_data = api_client.get_forecast(city_name)
            
            self._process_and_store_forecast_data(city_name, forecast_data)

            if settings.DEBUG:
                updated_data = DailyWeatherData.objects.filter(city_name=city_name).order_by('date')
            else:
                updated_data = DailyWeatherData.objects.filter(city_name=city_name, date__in=next_five_days)
            response_data = [self._format_weather_data(entry) for entry in updated_data]
            cache_timeout = _get_seconds_until_next_hour()
            cache.set(cache_key, response_data, timeout=cache_timeout)
            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException as e:
            return Response({"error": f"API request failed: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _process_and_store_forecast_data(self, city_name: str, forecast_data: Dict[str, Any]):
        """Process forecast data and store each day separately in the database."""
        daily_data = self._aggregate_forecast_data(forecast_data['list'])
        for date_obj, data in daily_data.items():
            DailyWeatherData.objects.update_or_create(
                city_name=city_name,
                date=date_obj,
                defaults={
                    "lon": forecast_data['city']['coord']['lon'],
                    "lat": forecast_data['city']['coord']['lat'],
                    "temperature": data["temp"],
                    "feels_like": data["feels_like"],
                    "temp_min": data["temp_min"],
                    "temp_max": data["temp_max"],
                    "pressure": data["pressure"],
                    "humidity": data["humidity"],
                    "weather_main": data["weather_main"],
                    "weather_description": data["weather_description"],
                    "wind_speed": data["wind_speed"],
                    "wind_deg": data["wind_deg"],
                    "timestamp": timezone.now()
                }
            )

    def _aggregate_forecast_data(self, forecast_list: List[Dict[str, Any]]) -> Dict[datetime.date, Dict[str, Any]]:
        """Aggregate forecast data by day, keeping the data for 12:00 (noon) each day."""
        daily_data = {}
        for entry in forecast_list:
            date_obj = datetime.strptime(entry['dt_txt'], '%Y-%m-%d %H:%M:%S').date()
            time = datetime.strptime(entry['dt_txt'], '%Y-%m-%d %H:%M:%S').time()
            
            # We'll use the data for 12:00 (noon) each day
            if time.hour == 12 or date_obj not in daily_data:
                main = entry['main']
                weather = entry['weather'][0]
                wind = entry['wind']

                daily_data[date_obj] = {
                    "temp": main['temp'],
                    "feels_like": main['feels_like'],
                    "temp_min": main['temp_min'],
                    "temp_max": main['temp_max'],
                    "pressure": main['pressure'],
                    "humidity": main['humidity'],
                    "weather_main": weather['main'],
                    "weather_description": weather['description'],
                    "wind_speed": wind['speed'],
                    "wind_deg": wind['deg']
                }

        return daily_data

    def _format_weather_data(self, entry: DailyWeatherData) -> Dict[str, Any]:
        """Format DailyWeatherData instance for API response."""
        return {
            "date": entry.date,
            "description": entry.weather_description,
            "icon": self._get_weather_icon(entry.weather_main),
            "temperature": {
                "min": entry.temp_min,
                "max": entry.temp_max
            },
            "wind": entry.wind_speed,
            "humidity": entry.humidity
        }

    def _get_weather_icon(self, weather_main: str) -> str:
        """Return an appropriate icon for the weather condition."""
        weather_icons = {
            "Clear": "01d",
            "Clouds": "02d",
            "Rain": "09d",
            "Drizzle": "10d",
            "Thunderstorm": "11d",
            "Snow": "13d",
            "Mist": "50d",
        }
        return weather_icons.get(weather_main, "01d")