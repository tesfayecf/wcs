import pytest
import requests
from unittest.mock import patch, Mock
from django.urls import reverse
from django.utils import timezone
from django.core.exceptions import ValidationError
from rest_framework import status
from django.core.cache import cache
from rest_framework.test import APIClient
from datetime import date, timedelta

from .models import Current, Daily
from .client import WeatherAPIClient

############
# Fixtures #
############

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def weather_api_client():
    return WeatherAPIClient()

@pytest.fixture
def mock_weather_response():
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
        wind_deg=250
    )

@pytest.fixture
def daily_weather():
    return Daily.objects.create(
        city_name="barcelona",
        lon=2.15899,
        lat=41.38879,
        date=date.today(),
        weather_main="Clear",
        weather_description="clear sky",
        temperature=28.5,
        feels_like=30.0,
        temp_min=27.0,
        temp_max=29.0,
        pressure=1012,
        humidity=40,
        wind_speed=3.6,
        wind_deg=250
    )

################
# Model Tests #
################

@pytest.mark.django_db
class TestCurrentModel:
    
    def test_current_weather_creation(self, current_weather):
        """Test creating a current weather record"""
        assert Current.objects.count() == 1
        assert str(current_weather) == "barcelona - Clear"
        assert current_weather.temperature == 28.5

    def test_unique_city_constraint(self, current_weather):
        """Test that city_name must be unique"""
        from django.db import transaction

        with pytest.raises(ValidationError):
            with transaction.atomic():
                current_weather = Current(
                    city_name="barcelona",
                    lon=2.15899,
                    lat=41.38879,
                    weather_main="Clear",
                    weather_description="clear sky",
                    temperature=25.0,
                    feels_like=26.0,
                    temp_min=24.0,
                    temp_max=26.0,
                    pressure=1010,
                    humidity=45,
                    wind_speed=3.0,
                    wind_deg=240
                )
                current_weather.full_clean()
                current_weather.save()

    def test_timestamp_auto_update(self, current_weather):
        """Test that timestamp is automatically updated"""
        old_timestamp = current_weather.timestamp
        current_weather.temperature = 29.0
        current_weather.save()
        assert current_weather.timestamp > old_timestamp

@pytest.mark.django_db
class TestDailyModel:
    
    def test_daily_weather_creation(self, daily_weather):
        """Test creating a daily weather record"""
        assert Daily.objects.count() == 1
        assert str(daily_weather) == f"barcelona - {date.today()}"

    def test_unique_city_date_constraint(self, daily_weather):
        """Test that city_name and date combination must be unique"""
        from django.db import transaction

        with pytest.raises(ValidationError):
            with transaction.atomic():
                daily_weather = Daily(
                    city_name="barcelona",
                    date=date.today(),
                    lon=2.15899,
                    lat=41.38879,
                    weather_main="Clear",
                    weather_description="clear sky",
                    temperature=25.0,
                    feels_like=26.0,
                    temp_min=24.0,
                    temp_max=26.0,
                    pressure=1010,
                    humidity=45,
                    wind_speed=3.0,
                    wind_deg=240
                )
                daily_weather.full_clean()
                daily_weather.save()

    def test_multiple_days_same_city(self, daily_weather):
        """Test creating multiple records for same city on different dates"""
        tomorrow = Daily.objects.create(
            city_name="barcelona",
            date=date.today() + timedelta(days=1),
            lon=2.15899,
            lat=41.38879,
            weather_main="Clear",
            weather_description="clear sky",
            temperature=26.0,
            feels_like=27.0,
            temp_min=25.0,
            temp_max=27.0,
            pressure=1011,
            humidity=42,
            wind_speed=3.2,
            wind_deg=245
        )
        assert Daily.objects.count() == 2

###############
# API Tests #
###############

@pytest.mark.skip
@pytest.mark.django_db
class TestWeatherAPI:
    
    def test_get_current_weather_cache(self, api_client, mock_weather_response):
        """Test retrieving weather data from cache"""
        cache_key = "current_weather_barcelona"
        cache.set(cache_key, mock_weather_response, timeout=300)

        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['main']['temp'] == 28.5
        assert not Current.objects.exists()  # Verify DB wasn't accessed

    def test_get_current_weather_database(self, api_client, current_weather):
        """Test retrieving weather data from database"""
        cache.clear()  # Ensure cache is empty
        
        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['main']['temp'] == 28.5

    @patch.object(WeatherAPIClient, 'get_current_weather')
    def test_get_current_weather_api(self, mock_get_current_weather, api_client, mock_weather_response):
        """Test retrieving weather data from external API"""
        cache.clear()
        Current.objects.all().delete()
        mock_get_current_weather.return_value = mock_weather_response

        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['main']['temp'] == 28.5
        assert Current.objects.count() == 1  # Verify data was saved to DB

    def test_get_weather_coordinates(self, api_client):
        """Test retrieving weather data by coordinates"""
        url = reverse('get_weather_by_coordinates')
        response = api_client.post(url, {
            "lat": 41.38879,
            "lon": 2.15899
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert 'main' in response.data
        assert 'temp' in response.data['main']

    @patch.object(WeatherAPIClient, 'get_forecast')
    def test_get_forecast(self, mock_get_forecast, api_client):
        """Test retrieving forecast data"""
        mock_forecast_data = [
            {
                'date': date.today(),
                'weather_main': 'Clear',
                'temperature': 28.5
            }
        ]
        mock_get_forecast.return_value = mock_forecast_data

        url = reverse('get_forecast_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) > 0

##################
# Error Tests #
##################

@pytest.mark.skip
@pytest.mark.django_db
class TestErrorHandling:
    
    def test_invalid_city(self, api_client):
        """Test handling of invalid city names"""
        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": ""})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    def test_invalid_coordinates(self, api_client):
        """Test handling of invalid coordinates"""
        url = reverse('get_weather_by_coordinates')
        response = api_client.post(url, {
            "lat": 91,  # Invalid latitude
            "lon": 2.15899
        })
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    @patch.object(WeatherAPIClient, 'get_current_weather')
    def test_api_timeout(self, mock_get_current_weather, api_client):
        """Test handling of API timeouts"""
        mock_get_current_weather.side_effect = requests.Timeout("Request timed out")
        cache.clear()
        Current.objects.all().delete()

        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert 'error' in response.data

    @patch.object(WeatherAPIClient, 'get_current_weather')
    def test_api_error(self, mock_get_current_weather, api_client):
        """Test handling of API errors"""
        mock_get_current_weather.side_effect = requests.RequestException("API Error")
        cache.clear()
        Current.objects.all().delete()

        url = reverse('get_current_weather')
        response = api_client.post(url, {"city_name": "barcelona"})

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert 'error' in response.data