import pytest
import requests
from unittest.mock import patch
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from django.core.cache import cache
from rest_framework.test import APIClient

from .models import Current, Daily
from .client import WeatherAPIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def current_weather_data():
    return {
        'coord': {'lon': 2.15899, 'lat': 41.38879},
        'weather': [{'main': 'Clear', 'description': 'clear sky'}],
        'main': {
            'temp': 28.5,
            'feels_like': 30.0,
            'temp_min': 27.0,
            'temp_max': 29.0,
            'pressure': 1012,
            'humidity': 40
        },
        'wind': {'speed': 3.6, 'deg': 250}
    }


@pytest.fixture
def current_weather():
    return Current.objects.create(
        city_name="barcelona",
        lon=2.15899,
        lat=41.38879,
        weather_main="Clear",
        weather_description="clear sky",
        temperature=28.5,
        feels_like=30.0,
        temp_min=27.0,
        temp_max=29.0,
        pressure=1012,
        humidity=40,
        wind_speed=3.6,
        wind_deg=250,
        timestamp=timezone.now()
    )


@pytest.mark.django_db
def test_get_weather_from_cache(api_client, current_weather_data):
    """Test if weather data is returned from cache when available."""
    cache_key = "current_weather_barcelona"
    cache.set(cache_key, current_weather_data, timeout=60)

    url = reverse('get_current_weather')  # Replace with the correct URL name
    response = api_client.post(url, {"city_name": "barcelona"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data['main']['temp'] == 28.5  # Ensure it's cached data


@pytest.mark.django_db
def test_get_weather_from_database(api_client, current_weather):
    """Test if weather data is returned from the database if cache is not available."""
    cache_key = "current_weather_barcelona"
    cache.delete(cache_key)  # Ensure cache is empty

    url = reverse('get_current_weather')
    response = api_client.post(url, {"city_name": "barcelona"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data['main']['temp'] == 28.5  # Ensure it's database data


@pytest.mark.django_db
@patch.object(WeatherAPIClient, 'get_current_weather')
def test_get_weather_from_api(api_client, mock_get_current_weather, current_weather_data):
    """Test if weather data is fetched from the API when not in cache or database."""
    mock_get_current_weather.return_value = current_weather_data

    # Clear cache and database to force API call
    cache_key = "current_weather_barcelona"
    cache.delete(cache_key)
    Current.objects.all().delete()

    url = reverse('get_current_weather')
    response = api_client.post(url, {"city_name": "barcelona"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data['main']['temp'] == 28.5  # Ensure it's API data


@pytest.mark.django_db
def test_invalid_city_name(api_client):
    """Test if invalid city name returns a 400 error."""
    url = reverse('get_current_weather')
    response = api_client.post(url, {"city_name": "invalid_city"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['error'] == "Invalid city name"


@pytest.mark.django_db
@patch.object(WeatherAPIClient, 'get_current_weather')
def test_api_request_failure(api_client, mock_get_current_weather):
    """Test if an API failure returns a 503 error."""
    mock_get_current_weather.side_effect = requests.RequestException("API request failed")

    # Ensure no cached or database data exists
    cache.delete("current_weather_barcelona")
    Current.objects.all().delete()

    url = reverse('get_current_weather')
    response = api_client.post(url, {"city_name": "barcelona"})

    assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert response.data['error'] == "API request failed: API request failed"


@pytest.mark.django_db
class TestWeatherAPI:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def current_weather_data(self):
        return {
            'coord': {'lon': 2.15899, 'lat': 41.38879},
            'weather': [{'main': 'Clear', 'description': 'clear sky'}],
            'main': {
                'temp': 28.5,
                'feels_like': 30.0,
                'temp_min': 27.0,
                'temp_max': 29.0,
                'pressure': 1012,
                'humidity': 40
            },
            'wind': {'speed': 3.6, 'deg': 250}
        }

    @pytest.fixture
    def current_weather(self):
        return Current.objects.create(
            city_name="barcelona",
            lon=2.15899,
            lat=41.38879,
            weather_main="Clear",
            weather_description="clear sky",
            temperature=28.5,
            feels_like=30.0,
            temp_min=27.0,
            temp_max=29.0,
            pressure=1012,
            humidity=40,
            wind_speed=3.6,
            wind_deg=250,
        )

    @pytest.mark.django_db
    def test_get_weather_by_coordinates(self, api_client, current_weather_data):
        """Test fetching weather data by coordinates."""
        url = reverse('get_weather_by_coordinates')
        with patch.object(WeatherAPIClient, 'get_current_weather_by_coordinates', return_value=current_weather_data):
            response = api_client.post(url, {"lat": 41.38879, "lon": 2.15899})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['main']['temp'] == 28.5

    @pytest.mark.django_db
    def test_get_forecast_weather(self, api_client):
        """Test fetching forecast weather data."""
        url = reverse('get_forecast_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)  # Ensure it returns a list of forecast data

    @pytest.mark.django_db
    def test_invalid_coordinates(self, api_client):
        """Test if missing coordinates returns a 400 error."""
        url = reverse('get_weather_by_coordinates')
        response = api_client.post(url, {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['error'] == "Latitude and longitude are required."

