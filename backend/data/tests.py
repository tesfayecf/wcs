from django.test import TestCase
from users.models import UserAccount
from .models import Group, Tank, Sensor

class GroupModelTest(TestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            # name="test_name",
            email="test_email",
            # first_name="test_first_name",
            # last_name="test_last_name",
            password="password"
        )
        self.group = Group.objects.create(name='Test Group', location='Test Location', user=self.user)

    def tearDown(self):
        self.group.delete()
        self.user.delete()

    def test_group_creation(self):
        """Test whether group is created successfully"""
        self.assertEqual(self.group.name, 'Test Group')
        self.assertEqual(self.group.location, 'Test Location')
        self.assertEqual(self.group.user, self.user)

    def test_group_unique_name(self):
        """Test uniqueness constraint on group name"""
        with self.assertRaises(Exception):
            Group.objects.create(name='Test Group', location='Test Location', user=self.user)

class TankModelTest(TestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            # name="test_name",
            email="test_email",
            # first_name="test_first_name",
            # last_name="test_last_name",
            password="password"
        )
        self.group = Group.objects.create(name='Test Group', location='Test Location', user=self.user)
        self.tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)

    def tearDown(self):
        self.tank.delete()
        self.group.delete()
        self.user.delete()

    def test_tank_creation(self):
        """Test whether tank is created successfully"""
        self.assertEqual(self.tank.name, 'Test Tank')
        self.assertEqual(self.tank.type, 'Storage')
        self.assertEqual(self.tank.capacity, 100)
        self.assertTrue(self.tank.is_active)
        self.assertEqual(self.tank.group, self.group)

    def test_tank_unique_name_within_group(self):
        """Test uniqueness constraint on tank name within group"""
        with self.assertRaises(Exception):
            Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)

class SensorModelTest(TestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            # name="test_name",
            email="test_email",
            # first_name="test_first_name",
            # last_name="test_last_name",
            password="password"
        )
        self.group = Group.objects.create(name='Test Group', location='Test Location', user=self.user)
        self.tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)
        self.sensor = Sensor.objects.create(token='123', is_active=True, tank=self.tank)

    def tearDown(self):
        self.sensor.delete()
        self.tank.delete()
        self.group.delete()
        self.user.delete()

    def test_sensor_creation(self):
        """Test whether sensor is created successfully"""
        self.assertEqual(self.sensor.token, '123')
        self.assertTrue(self.sensor.is_active)
        self.assertEqual(self.sensor.tank, self.tank)

    def test_sensor_unique_token(self):
        """Test uniqueness constraint on sensor token"""
        with self.assertRaises(Exception):
            Sensor.objects.create(token='123', is_active=True, tank=self.tank)
