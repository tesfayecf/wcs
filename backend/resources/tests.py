import pytest
from django.contrib.auth import get_user_model
from .models import Group, Tank, Sensor

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(
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
        assert group.name == 'Test Group', "Group name does not match"
        assert group.location == 'Test Location', "Group location does not match"
        assert group.user == user, "Group user does not match"

    def test_group_deletion_cascade(self, group):
        group_id = group.id
        group.delete()
        assert not Group.objects.filter(pk=group_id).exists(), "Group should be deleted"

@pytest.mark.django_db
class TestTankModel:
    def test_tank_creation(self, group):
        tank = Tank.objects.create(name='Test Tank', type='Storage', capacity=100, is_active=True, group=group)
        assert tank.name == 'Test Tank', "Tank name does not match"
        assert tank.type == 'Storage', "Tank type does not match"
        assert tank.capacity == 100, "Tank capacity does not match"
        assert tank.is_active, "Tank should be active"
        assert tank.group == group, "Tank group does not match"

    def test_tank_deletion_cascade(self, tank):
        tank_id = tank.id
        tank.delete()
        assert not Tank.objects.filter(pk=tank_id).exists(), "Tank should be deleted"
        assert not Sensor.objects.filter(tank=tank).exists(), "Related sensors should be deleted"

@pytest.mark.django_db
class TestSensorModel:
    def test_sensor_creation(self, tank):
        sensor = Sensor.objects.create(sensor_id='123', is_active=True, tank=tank)
        assert sensor.sensor_id == '123', "Sensor ID does not match"
        assert sensor.is_active, "Sensor should be active"
        assert sensor.tank == tank, "Sensor tank does not match"

    def test_sensor_deletion(self, sensor):
        sensor_id = sensor.id
        sensor.delete()
        assert not Sensor.objects.filter(pk=sensor_id).exists(), "Sensor should be deleted"
