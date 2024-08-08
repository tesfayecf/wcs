import pytest
from rest_framework.test import APIRequestFactory
from django.utils import timezone
from datetime import timedelta

from .models import SensorReading, SensorLog
from .views import GetSensorReadingsView, GetSensorLogsView
from users.models import UserAccount
from data.models import Group, Tank, Sensor

@pytest.fixture
def user():
    return UserAccount.objects.create_user(
        first_name="test_first_name",
        last_name="test_last_name",
        email="test@example.com",
        password="password"
    )

@pytest.fixture
def group(user):
    return Group.objects.create(name='Test Group', location='Test Location', user=user)

@pytest.fixture
def tank(group):
    return Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=group)

@pytest.fixture
def sensor(tank):
    return Sensor.objects.create(sensor_id='test_sensor', is_active=True, tank=tank)

@pytest.fixture
def sensor_readings(sensor):
    now = timezone.now()
    SensorReading.objects.create(distance=10.5, sensor=sensor, time=now - timedelta(hours=1))
    SensorReading.objects.create(distance=15.3, sensor=sensor, time=now - timedelta(minutes=30))
    SensorReading.objects.create(distance=20.1, sensor=sensor, time=now - timedelta(days=1))

@pytest.fixture
def sensor_logs(sensor):
    now = timezone.now()
    SensorLog.objects.create(
        status='INFO',
        status_message='Sensor operational',
        signal_strength=80,
        battery_voltage=3.7,
        battery_percentage=90,
        sensor=sensor,
        time=now - timedelta(hours=1)
    )
    SensorLog.objects.create(
        status='WARNING',
        status_message='Battery low',
        signal_strength=60,
        battery_voltage=3.2,
        battery_percentage=20,
        sensor=sensor,
        time=now - timedelta(minutes=30)
    )
    SensorLog.objects.create(
        status='ERROR',
        status_message='Sensor malfunction',
        signal_strength=30,
        battery_voltage=2.8,
        battery_percentage=5,
        sensor=sensor,
        time=now - timedelta(days=1)
    )

@pytest.mark.django_db
class TestGetSensorReadingsView:
    @pytest.fixture(autouse=True)
    def setup(self, user, sensor, sensor_readings):
        self.factory = APIRequestFactory()
        self.user = user
        self.sensor = sensor
        self.view = GetSensorReadingsView.as_view()

    def test_get_sensor_readings(self):
        request_data = {
            'id': self.sensor.pk,
            'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
            'end_time': timezone.now().isoformat(),
            'period': '1',
            'timeframe': 'day'
        }

        request = self.factory.post('/api/sensors/sensor-readings/', data=request_data, format='json')
        request.user = self.user

        response = self.view(request)

        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
        assert 'sensor_readings' in response.data, "Response data should contain 'sensor_readings'"
        assert len(response.data['sensor_readings']) == 3, f"Expected 3 sensor readings, but got {len(response.data['sensor_readings'])}"

        distances = [reading['distance'] for reading in response.data['sensor_readings']]
        assert 10.5 in distances, "Expected distance 10.5 in the response"
        assert 15.3 in distances, "Expected distance 15.3 in the response"
        assert 20.1 in distances, "Expected distance 20.1 in the response"

    def test_get_sensor_readings_invalid_sensor(self):
        request_data = {
            'id': 9999,  # Non-existent sensor ID
            'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
            'end_time': timezone.now().isoformat(),
            'period': '1',
            'timeframe': 'day'
        }

        request = self.factory.post('/api/sensors/sensor-readings/', data=request_data, format='json')
        request.user = self.user

        response = self.view(request)

        assert response.status_code == 404, f"Expected status code 404, but got {response.status_code}"
        assert 'error' in response.data, "Response should contain an 'error' key for invalid sensor"

    def test_get_sensor_readings_invalid_date_range(self):
        request_data = {
            'id': self.sensor.pk,
            'start_time': timezone.now().isoformat(),
            'end_time': (timezone.now() - timedelta(days=1)).isoformat(),  # End time before start time
            'period': '1',
            'timeframe': 'day'
        }

        request = self.factory.post('/api/sensors/sensor-readings/', data=request_data, format='json')
        request.user = self.user

        response = self.view(request)

        assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
        assert 'error' in response.data, "Response should contain an 'error' key for invalid date range"

    def test_get_sensor_readings_missing_parameters(self):
        request_data = {
            'id': self.sensor.pk,
            # Missing 'start_time' and 'end_time'
            'period': '1',
            'timeframe': 'day'
        }

        request = self.factory.post('/api/sensors/sensor-readings/', data=request_data, format='json')
        request.user = self.user

        response = self.view(request)

        assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
        assert 'error' in response.data, "Response should contain an 'error' key for missing parameters"

    def test_get_sensor_readings_invalid_period(self):
        request_data = {
            'id': self.sensor.pk,
            'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
            'end_time': timezone.now().isoformat(),
            'period': 'invalid_period',  # Invalid period
            'timeframe': 'day'
        }

        request = self.factory.post('/api/sensors/sensor-readings/', data=request_data, format='json')
        request.user = self.user

        response = self.view(request)

        assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
        assert 'error' in response.data, "Response should contain an 'error' key for invalid period"

# @pytest.mark.django_db
# class TestGetSensorLogsView:
#     @pytest.fixture(autouse=True)
#     def setup(self, user, sensor, sensor_logs):
#         self.factory = APIRequestFactory()
#         self.user = user
#         self.sensor = sensor
#         self.view = GetSensorLogsView.as_view()

#     def test_get_sensor_logs(self):
#         request_data = {
#             'id': self.sensor.pk,
#             'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
#             'end_time': timezone.now().isoformat(),
#             'period': '1',
#             'timeframe': 'day'
#         }

#         request = self.factory.post('/api/sensors/sensor-logs/', data=request_data, format='json')
#         request.user = self.user

#         response = self.view(request)

#         assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
#         assert 'sensor_logs' in response.data, "Response data should contain 'sensor_logs'"
#         assert len(response.data['sensor_logs']) == 3, f"Expected 3 sensor logs, but got {len(response.data['sensor_logs'])}"

#         statuses = [log['status'] for log in response.data['sensor_logs']]
#         assert 'INFO' in statuses, "Expected status 'INFO' in the response"
#         assert 'WARNING' in statuses, "Expected status 'WARNING' in the response"
#         assert 'ERROR' in statuses, "Expected status 'ERROR' in the response"

#     def test_get_sensor_logs_invalid_sensor(self):
#         request_data = {
#             'id': 9999,  # Non-existent sensor ID
#             'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
#             'end_time': timezone.now().isoformat(),
#             'period': '1',
#             'timeframe': 'day'
#         }

#         request = self.factory.post('/api/sensors/sensor-logs/', data=request_data, format='json')
#         request.user = self.user

#         response = self.view(request)

#         assert response.status_code == 404, f"Expected status code 404, but got {response.status_code}"
#         assert 'error' in response.data, "Response should contain an 'error' key for invalid sensor"

#     def test_get_sensor_logs_invalid_date_range(self):
#         request_data = {
#             'id': self.sensor.pk,
#             'start_time': timezone.now().isoformat(),
#             'end_time': (timezone.now() - timedelta(days=1)).isoformat(),  # End time before start time
#             'period': '1',
#             'timeframe': 'day'
#         }

#         request = self.factory.post('/api/sensors/sensor-logs/', data=request_data, format='json')
#         request.user = self.user

#         response = self.view(request)

#         assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
#         assert 'error' in response.data, "Response should contain an 'error' key for invalid date range"

#     def test_get_sensor_logs_missing_parameters(self):
#         request_data = {
#             'id': self.sensor.pk,
#             # Missing 'start_time' and 'end_time'
#             'period': '1',
#             'timeframe': 'day'
#         }

#         request = self.factory.post('/api/sensors/sensor-logs/', data=request_data, format='json')
#         request.user = self.user

#         response = self.view(request)

#         assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
#         assert 'error' in response.data, "Response should contain an 'error' key for missing parameters"

#     def test_get_sensor_logs_invalid_period(self):
#         request_data = {
#             'id': self.sensor.pk,
#             'start_time': (timezone.now() - timedelta(days=1)).isoformat(),
#             'end_time': timezone.now().isoformat(),
#             'period': 'invalid_period',  # Invalid period
#             'timeframe': 'day'
#         }

#         request = self.factory.post('/api/sensors/sensor-logs/', data=request_data, format='json')
#         request.user = self.user

#         response = self.view(request)

#         assert response.status_code == 400, f"Expected status code 400, but got {response.status_code}"
#         assert 'error' in response.data, "Response should contain an 'error' key for invalid period"