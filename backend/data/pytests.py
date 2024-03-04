from django.contrib.auth import get_user_model
import pytest
from .models import Group, Tank, Sensor

UserAccount = get_user_model()

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
    return Sensor.objects.create(sensor_id='123', is_active=True, tank=tank)

@pytest.mark.django_db
class TestGroupModel:
    def test_group_creation(self, user):
        group = Group.objects.create(name='Test Group', location='Test Location', user=user)
        assert group.name == 'Test Group'
        assert group.location == 'Test Location'
        assert group.user == user

    def test_group_unique_name(self, user):
        Group.objects.create(name='Test Group', location='Test Location', user=user)
        with pytest.raises(Exception):
            Group.objects.create(name='Test Group', location='Test Location', user=user)

@pytest.mark.django_db
class TestTankModel:
    def test_tank_creation(self, group):
        tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=group)
        assert tank.name == 'Test Tank'
        assert tank.type == 'Storage'
        assert tank.capacity == 100
        assert tank.is_active
        assert tank.group == group

    # def test_one_sensor_per_tank(self, tank):
    #     Sensor.objects.create(sensor_id='Sensor 1', is_active=True, tank=tank)
    #     with pytest.raises(Exception):
    #         Sensor.objects.create(sensor_id='Sensor 2', is_active=True, tank=tank)
    #     assert Sensor.objects.filter(tank=tank).count() == 1

    # You can implement this test similarly to the above one
    # def test_tank_unique_name_within_group(self, group):
    #     pass

@pytest.mark.django_db
class TestSensorModel:
    def test_sensor_creation(self, tank):
        sensor = Sensor.objects.create(sensor_id='123', is_active=True, tank=tank)
        assert sensor.sensor_id == '123'
        assert sensor.is_active
        assert sensor.tank == tank

    def test_sensor_unique_token(self, tank):
        Sensor.objects.create(sensor_id='123', is_active=True, tank=tank)
        with pytest.raises(Exception):
            Sensor.objects.create(sensor_id='123', is_active=True, tank=tank)
