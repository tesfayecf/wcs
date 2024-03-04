from django.test import TestCase
from rest_framework.test import APIRequestFactory

from .models import SensorReading
from users.models import UserAccount
from data.models import Group, Tank, Sensor
from .views import GetSensorReadingsView

class GetSensorReadingsViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        
        # Create a user
        self.user = UserAccount.objects.create(
            first_name="test_first_name",
            last_name="test_last_name",
            email='test@example.com', 
            password='password'
        )
        
        # Create a sensor and sensor readings for testing
        self.group = Group.objects.create(name='Test Group', location='Test Location', user=self.user)
        self.tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)
        self.sensor = Sensor.objects.create(sensor_id='test_sensor', is_active=True, tank=self.tank)
        self.reading1 = SensorReading.objects.create(distance=10.5, sensor=self.sensor)
        self.reading2 = SensorReading.objects.create(distance=15.3, sensor=self.sensor)

    def test_get_sensor_readings(self):
        # Define the request data
        request_data = {
            'id': self.sensor.pk,
            'start_time': '2022-01-01T00:00:00',
            'end_time': '2022-01-02T00:00:00',
            'period': '1',
            'timeframe': 'day'
        }
        
        # Create a POST request to the view
        request = self.factory.post('http://localhost:8000/api/sensors/sensor-readings/', data=request_data)
        request.user = self.user  # Assign the user to the request
        
        # Initialize the view and handle the request
        view = GetSensorReadingsView.as_view()
        response = view(request)
        
        print(response)
        
        # Assert the response status code
        self.assertEqual(response.status_code, 200)
        
        print(response.data)
        
        # Assert the response data
        expected_data = {
            'sensor_readings': [
                {'distance': 10.5},
                {'distance': 15.3}
            ]
        }
        self.assertEqual(response.data, expected_data)
