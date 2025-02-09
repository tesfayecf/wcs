import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from datetime import date, timedelta
from .models import Group, Tank, Sensor, TankType, SensorStatus

User = get_user_model()

############
# Fixtures #
############

@pytest.fixture
def user1():
    return User.objects.create_user(
        first_name="test_first_name1",
        last_name="test_last_name1",
        email="test1@example.com",
        password="password123"
    )

@pytest.fixture
def user2():
    return User.objects.create_user(
        first_name="test_first_name2",
        last_name="test_last_name2",
        email="test2@example.com",
        password="password123"
    )

@pytest.fixture
def group1(user1):
    return Group.objects.create(
        name='Test Group 1',
        location='Test Location 1',
        description='Test Description 1',
        user=user1
    )

@pytest.fixture
def group2(user1):
    return Group.objects.create(
        name='Test Group 2',
        location='Test Location 2',
        description='Test Description 2',
        user=user1
    )

@pytest.fixture
def tank1(group1):
    return Tank.objects.create(
        name='Test Tank 1',
        description='Test Description 1',
        type=TankType.STORAGE,
        capacity=100,
        is_active=True,
        group=group1
    )

@pytest.fixture
def tank2(group1):
    return Tank.objects.create(
        name='Test Tank 2',
        description='Test Description 2',
        type=TankType.WELL,
        capacity=200,
        is_active=True,
        group=group1
    )

@pytest.fixture
def sensor1(tank1):
    return Sensor.objects.create(
        name='Test Sensor 1',
        description='Test Description 1',
        notes='Test Notes 1',
        device_id='TEST001',
        status=SensorStatus.IDLE,
        installation_date=date.today(),
        maintenance_date=date.today() + timedelta(days=30),
        is_active=True,
        tank=tank1
    )

@pytest.fixture
def sensor2(tank1):
    return Sensor.objects.create(
        name='Test Sensor 2',
        description='Test Description 2',
        notes='Test Notes 2',
        device_id='TEST002',
        status=SensorStatus.CONNECTED,
        installation_date=date.today(),
        maintenance_date=date.today() + timedelta(days=30),
        is_active=True,
        tank=tank1
    )

################
# Group Tests #
################

@pytest.mark.django_db
class TestGroupModel:
    
    def test_group_creation(self, user1):
        """Test basic group creation with all fields"""
        group = Group.objects.create(
            name='Test Group',
            location='Test Location',
            description='Test Description',
            user=user1
        )
        assert group.name == 'Test Group'
        assert group.location == 'Test Location'
        assert group.description == 'Test Description'
        assert group.user == user1
        assert group.created_at is not None
        assert group.edited_at is not None

    def test_group_str_representation(self, group1):
        """Test the string representation of a group"""
        assert str(group1) == 'Test Group 1'

    def test_group_unique_name_per_user(self, user1, user2, group1):
        """Test that group names must be unique per user"""
        from django.db import transaction

        # Same name, same user should fail
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                Group.objects.create(
                    name=group1.name,
                    location='Different Location',
                    user=user1
                )
        
        # Same name, different user should succeed
        group = Group.objects.create(
            name=group1.name,
            location='Different Location',
            user=user2
        )
        assert group.name == group1.name
        assert group.user == user2

    def test_group_blank_description(self, user1):
        """Test that description can be blank"""
        group = Group.objects.create(
            name='Test Group',
            location='Test Location',
            description='',
            user=user1
        )
        assert group.description == ''

    def test_group_cascade_deletion(self, group1, tank1, sensor1):
        """Test that deleting a group cascades to tanks and sensors"""
        group_id = group1.id
        tank_id = tank1.id
        sensor_id = sensor1.id
        
        group1.delete()
        
        assert not Group.objects.filter(id=group_id).exists()
        assert not Tank.objects.filter(id=tank_id).exists()
        assert not Sensor.objects.filter(id=sensor_id).exists()

###############
# Tank Tests #
###############

@pytest.mark.django_db
class TestTankModel:
    
    def test_tank_creation(self, group1):
        """Test basic tank creation with all fields"""
        tank = Tank.objects.create(
            name='Test Tank',
            description='Test Description',
            type=TankType.STORAGE,
            capacity=100,
            is_active=True,
            group=group1
        )
        assert tank.name == 'Test Tank'
        assert tank.description == 'Test Description'
        assert tank.type == TankType.STORAGE
        assert tank.capacity == 100
        assert tank.is_active is True
        assert tank.group == group1
        assert tank.created_at is not None
        assert tank.edited_at is not None

    def test_tank_str_representation(self, tank1):
        """Test the string representation of a tank"""
        assert str(tank1) == 'Test Tank 1'

    def test_tank_unique_name_per_group(self, group1, group2, tank1):
        """Test that tank names must be unique per group"""
        from django.db import transaction

        # Same name, same group should fail
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                Tank.objects.create(
                    name=tank1.name,
                    type=TankType.STORAGE,
                    capacity=100,
                    group=group1
                )
        
        # Same name, different group should succeed
        tank = Tank.objects.create(
            name=tank1.name,
            type=TankType.STORAGE,
            capacity=100,
            group=group2
        )
        assert tank.name == tank1.name
        assert tank.group == group2

    def test_tank_invalid_capacity(self, group1):
        """Test that capacity must be positive"""
        with pytest.raises(IntegrityError):
            Tank.objects.create(
                name='Test Tank',
                type=TankType.STORAGE,
                capacity=-100,
                group=group1
            )

    def test_tank_type_choices(self, group1):
        """Test all possible tank types"""
        for tank_type in TankType.choices:
            tank = Tank.objects.create(
                name=f'Tank {tank_type[0]}',
                type=tank_type[0],
                capacity=100,
                group=group1
            )
            assert tank.type == tank_type[0]

    def test_sensor_cascade_deletion(self, tank1, sensor1):
        """Test that deleting a tank cascades to sensors"""
        tank_id = tank1.id
        sensor_id = sensor1.id
        
        tank1.delete()
        
        assert not Tank.objects.filter(id=tank_id).exists()
        assert not Sensor.objects.filter(id=sensor_id).exists()

#################
# Sensor Tests #
#################

@pytest.mark.django_db
class TestSensorModel:

    def test_sensor_creation(self, tank1):
        """Test basic sensor creation with all fields"""
        sensor = Sensor.objects.create(
            name='Test Sensor',
            description='Test Description',
            notes='Test Notes',
            device_id='TEST003',
            status=SensorStatus.IDLE,
            installation_date=date.today(),
            maintenance_date=date.today() + timedelta(days=30),
            is_active=True,
            tank=tank1
        )
        assert sensor.name == 'Test Sensor'
        assert sensor.description == 'Test Description'
        assert sensor.notes == 'Test Notes'
        assert sensor.device_id == 'TEST003'
        assert sensor.status == SensorStatus.IDLE
        assert sensor.installation_date == date.today()
        assert sensor.maintenance_date == date.today() + timedelta(days=30)
        assert sensor.is_active is True
        assert sensor.tank == tank1
        assert sensor.created_at is not None
        assert sensor.edited_at is not None

    def test_sensor_str_representation(self, sensor1):
        """Test the string representation of a sensor"""
        assert str(sensor1) == 'TEST001'

    def test_sensor_unique_device_id(self, tank1, sensor1):
        """Test that device_id must be unique"""
        with pytest.raises(IntegrityError):
            Sensor.objects.create(
                name='Different Sensor',
                device_id=sensor1.device_id,
                status=SensorStatus.IDLE,
                tank=tank1
            )

    def test_sensor_unique_name_per_tank(self, tank1, tank2, sensor1):
        """Test that sensor names must be unique per tank"""
        from django.db import transaction

        # Same name, same tank should fail
        with pytest.raises(IntegrityError):
            with transaction.atomic():
                Sensor.objects.create(
                    name=sensor1.name,
                    device_id='DIFFERENT001',
                    status=SensorStatus.IDLE,
                    tank=tank1
                )
        
        # Same name, different tank should succeed
        sensor = Sensor.objects.create(
            name=sensor1.name,
            device_id='DIFFERENT001',
            status=SensorStatus.IDLE,
            tank=tank2
        )
        assert sensor.name == sensor1.name
        assert sensor.tank == tank2

    def test_sensor_status_choices(self, tank1):
        """Test all possible sensor statuses"""
        for status in SensorStatus.choices:
            sensor = Sensor.objects.create(
                name=f'Sensor {status[0]}',
                device_id=f'TEST{status[0]}',
                status=status[0],
                tank=tank1
            )
            assert sensor.status == status[0]

    def test_sensor_optional_dates(self, tank1):
        """Test that installation and maintenance dates are optional"""
        sensor = Sensor.objects.create(
            name='Test Sensor',
            device_id='TEST999',
            status=SensorStatus.IDLE,
            installation_date=None,
            maintenance_date=None,
            tank=tank1
        )
        assert sensor.installation_date is None
        assert sensor.maintenance_date is None

    def test_sensor_blank_fields(self, tank1):
        """Test that description and notes can be blank"""
        sensor = Sensor.objects.create(
            name='Test Sensor',
            description='',
            notes='',
            device_id='TEST998',
            status=SensorStatus.IDLE,
            tank=tank1
        )
        assert sensor.description == ''
        assert sensor.notes == ''

