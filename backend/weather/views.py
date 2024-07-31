import json
import requests
from datetime import timedelta, datetime
from typing import Dict, Any, List
from pydantic import ValidationError

from django.conf import settings
from django.utils import timezone
from django.core.cache import cache

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .client import WeatherAPIClient
from .schemas import GetWeatherSchema
from .models import CurrentWeatherData, DailyWeatherData

class GetCurrentWeatherView(APIView):
    def post(self, request):
        try:
            # Validate incoming data using Pydantic schema
            get_weather_data = GetWeatherSchema(**request.data)
            city_name = get_weather_data.city_name.lower()

            # Try to get data from cache first
            cache_key = f"current_weather_{city_name}"
            cached_data = cache.get(cache_key)
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            # Check if recent weather data exists in the database
            weather_data = CurrentWeatherData.objects.filter(city_name=city_name).first()
            if weather_data and (timezone.now() - weather_data.timestamp) < timedelta(hours=1):
                response_data = self._format_current_weather_response(weather_data)
                cache_timeout = self._get_seconds_until_next_hour()
                cache.set(cache_key, response_data, timeout=cache_timeout)
                return Response(response_data, status=status.HTTP_200_OK)

            # Fetch new data from API
            api_client = WeatherAPIClient()
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
            # Validate incoming data using schema
            get_weather_data = GetWeatherSchema(**request.data)
            city_name = get_weather_data.city_name.lower()

            # Try to get data from cache first
            cache_key = f"forecast_weather_{city_name}"
            cached_data = cache.get(cache_key)
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            # Get today's date and next five days
            today = timezone.now().date()
            next_five_days = [today + timedelta(days=i) for i in range(5)]

            # Check if data already exists in database
            existing_data = DailyWeatherData.objects.filter(city_name=city_name, date__in=next_five_days)

            if existing_data.count() == 5:
                response_data = {"data": [self._format_weather_data(entry) for entry in existing_data]}
                cache_timeout = _get_seconds_until_next_hour()
                cache.set(cache_key, response_data, timeout=cache_timeout)
                return Response(response_data, status=status.HTTP_200_OK)

            # Fetch new data from API
            api_client = WeatherAPIClient()
            forecast_data = api_client.get_forecast(city_name)
            
            # Process API response and store data
            self._process_and_store_forecast_data(city_name, forecast_data['list'])

            # Retrieve and return updated data from database
            updated_data = DailyWeatherData.objects.filter(city_name=city_name, date__in=next_five_days)
            response_data = {"data": [self._format_weather_data(entry) for entry in updated_data]}
            cache_timeout = self._get_seconds_until_next_hour()
            cache.set(cache_key, response_data, timeout=cache_timeout)
            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException as e:
            return Response({"error": f"API request failed: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _process_and_store_forecast_data(self, city_name: str, forecast_list: List[Dict[str, Any]]):
        """Process forecast data and store it in the database."""
        daily_data = self._aggregate_forecast_data(forecast_list)
        
        for date_obj, data in daily_data.items():
            DailyWeatherData.objects.update_or_create(
                city_name=city_name,
                date=date_obj,
                defaults={
                    "lon": data["coords"][0],
                    "lat": data["coords"][1],
                    "temperature": sum(data["temps"]) / len(data["temps"]),
                    "feels_like": sum(data["feels_likes"]) / len(data["feels_likes"]),
                    "temp_min": min(data["temp_mins"]),
                    "temp_max": max(data["temp_maxs"]),
                    "pressure": int(sum(data["pressures"]) / len(data["pressures"])),
                    "humidity": int(sum(data["humidities"]) / len(data["humidities"])),
                    "weather_main": max(set(data["weather_mains"]), key=data["weather_mains"].count),
                    "weather_description": max(set(data["weather_descriptions"]), key=data["weather_descriptions"].count),
                    "wind_speed": sum(data["wind_speeds"]) / len(data["wind_speeds"]),
                    "wind_deg": int(sum(data["wind_degs"]) / len(data["wind_degs"])),
                    "timestamp": timezone.now()
                }
            )

    def _aggregate_forecast_data(self, forecast_list: List[Dict[str, Any]]) -> Dict[datetime.date, Dict[str, List]]:
        """Aggregate forecast data by day."""
        daily_data = {}
        for entry in forecast_list:
            date_obj = datetime.strptime(entry['dt_txt'].split()[0], '%Y-%m-%d').date()
            if date_obj not in daily_data:
                daily_data[date_obj] = {
                    "coords": [entry['coord']['lon'], entry['coord']['lat']],
                    "temps": [], "feels_likes": [], "temp_mins": [], "temp_maxs": [],
                    "pressures": [], "humidities": [], "wind_speeds": [], "wind_degs": [],
                    "weather_mains": [], "weather_descriptions": []
                }

            main = entry['main']
            weather = entry['weather'][0]
            wind = entry['wind']

            for key in ['temp', 'feels_like', 'temp_min', 'temp_max', 'pressure', 'humidity']:
                daily_data[date_obj][f"{key}s"].append(main[key])
            daily_data[date_obj]["wind_speeds"].append(wind["speed"])
            daily_data[date_obj]["wind_degs"].append(wind["deg"])
            daily_data[date_obj]["weather_mains"].append(weather["main"])
            daily_data[date_obj]["weather_descriptions"].append(weather["description"])

        return daily_data

    def _format_weather_data(self, entry: DailyWeatherData) -> Dict[str, Any]:
        """Format DailyWeatherData instance for API response."""
        return {
            "city_name": entry.city_name,
            "date": entry.date,
            "temperature": entry.temperature,
            "feels_like": entry.feels_like,
            "temp_min": entry.temp_min,
            "temp_max": entry.temp_max,
            "pressure": entry.pressure,
            "humidity": entry.humidity,
            "weather_main": entry.weather_main,
            "weather_description": entry.weather_description,
            "wind_speed": entry.wind_speed,
            "wind_deg": entry.wind_deg,
            "timestamp": entry.timestamp
        }

def _get_seconds_until_next_hour(self) -> int:
    """Calculate the number of seconds until the next hour."""
    now = timezone.now()
    next_hour = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
    return int((next_hour - now).total_seconds())
