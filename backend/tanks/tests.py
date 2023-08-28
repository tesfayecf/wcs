from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User
from .models import TankGroup, Tank

class TankGroupModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tank_group = TankGroup.objects.create(name='Test Group', location='Test Location', user=self.user)

    def test_total_tanks(self):
        self.assertEqual(self.tank_group.total_tanks(), 0)

    def test_get_total_capacity(self):
        self.assertEqual(self.tank_group.get_total_capacity(), 0)

    def test_str_representation(self):
        self.assertEqual(str(self.tank_group), 'Test Group')

class TankModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tank_group = TankGroup.objects.create(name='Test Group', location='Test Location', user=self.user)
        self.tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, isActive=True, dimensions='10x10x10', material='Test Material', brand='Test Brand', tankGroup=self.tank_group)

    def test_has_sensor_assigned(self):
        self.assertFalse(self.tank.has_sensor_assigned())

    def test_str_representation(self):
        self.assertEqual(str(self.tank), 'Test Tank')

class TankGroupViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_get_tank_groups(self):
        response = self.client.post('/api/tank-groups/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_create_tank_group(self):
        data = {
            'name': 'New Group',
            'location': 'New Location',
            'description': 'New Description'
        }
        response = self.client.post('/api/create-tank-group/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'New Group')
        self.assertEqual(response.data['location'], 'New Location')

    # Add more tests for other views...
