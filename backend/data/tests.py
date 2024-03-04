from django.test import TestCase, TransactionTestCase
from users.models import UserAccount
from .models import Group, Tank, Sensor

# TODO: add views tests

class GroupModelTest(TransactionTestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            first_name="test_first_name",
            last_name="test_last_name",
            email="test@example.com",
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

class TankModelTest(TransactionTestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            first_name="test_first_name",
            last_name="test_last_name",
            email="test@example.com",
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

    def test_one_sensor_per_tank(self):
        """Test that each tank can only have one sensor"""
        # Create a sensor and associate it with the tank
        sensor1 = Sensor.objects.create(sensor_id='Sensor 1', is_active=True, tank=self.tank)

        # Attempt to create another sensor associated with the same tank
        with self.assertRaises(Exception):
            Sensor.objects.create(sensor_id='Sensor 2', is_active=True, tank=self.tank)

        # Verify that only one sensor is associated with the tank
        count = Sensor.objects.filter(tank=self.tank).count()
        self.assertEqual(count, 1)
    
    def test_tank_unique_name_within_group(self):
    #     """Test uniqueness constraint on tank name within group"""
    #     with self.assertRaises(Exception):
    #         Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)    
        pass

class SensorModelTest(TransactionTestCase):
    def setUp(self):
        self.user = UserAccount.objects.create_user(
            first_name="test_first_name",
            last_name="test_last_name",
            email="test@example.com",
            password="password"
        )
        self.group = Group.objects.create(name='Test Group', location='Test Location', user=self.user)
        self.tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=self.group)
        self.sensor = Sensor.objects.create(sensor_id='123', is_active=True, tank=self.tank)

    def tearDown(self):
        self.sensor.delete()
        self.tank.delete()
        self.group.delete()
        self.user.delete()

    def test_sensor_creation(self):
        """Test whether sensor is created successfully"""
        self.assertEqual(self.sensor.sensor_id, '123')
        self.assertTrue(self.sensor.is_active)
        self.assertEqual(self.sensor.tank, self.tank)

    def test_sensor_unique_token(self):
        """Test uniqueness constraint on sensor token"""
        with self.assertRaises(Exception):
            Sensor.objects.create(sensor_id='123', is_active=True, tank=self.tank)
