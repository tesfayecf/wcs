import json
import requests
from typing import Dict, Any

from django.conf import settings

class WeatherAPIClient:
    """A client for interacting with the OpenWeatherMap API."""

    BASE_URL = "http://api.openweathermap.org/data/2.5"
    
    def __init__(self):
        self.api_key = settings.OPENWEATHERMAP_API_KEY
        self.units = "metric"
        self.lang = "en"
        self.mode = "json"

    def get_current_weather(self, city_name: str) -> Dict[str, Any]:
        """Fetch current weather data for a given city."""
        if settings.DEVELOPMENT_MODE:
            with open("C:/Users/tesfa/Documents/Programming/WCS/Code/src/backend/weather/data/current_weather.json", "r") as f:
                return json.load(f)

        url = f"{self.BASE_URL}/weather"
        params = self._get_common_params(city_name)
        return self._make_request(url, params)

    def get_forecast(self, city_name: str) -> Dict[str, Any]:
        """Fetch 5-day forecast data for a given city."""
        if settings.DEVELOPMENT_MODE:
            with open("C:/Users/tesfa/Documents/Programming/WCS/Code/src/backend/weather/data/forecast_weather.json", "r") as f:
                return json.load(f)
            
        url = f"{self.BASE_URL}/forecast"
        params = self._get_common_params(city_name)
        return self._make_request(url, params)
    
    def _get_common_params(self, city_name: str) -> Dict[str, str]:
        """Get common query parameters for API requests."""
        return {
            "q": city_name,
            "appid": self.api_key,
            "units": self.units,
            "lang": self.lang,
            "mode": self.mode
        }

    def _make_request(self, url: str, params: Dict[str, str]) -> Dict[str, Any]:
        """Make a request to the OpenWeatherMap API."""
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
