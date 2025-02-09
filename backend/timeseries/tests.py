import pytest
from django.utils import timezone
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from .models import Measure, MeasureType, Channel, Chunk, Record
from resources.models import Group, Tank, Sensor, TankType, SensorStatus
from datetime import date, timedelta

User = get_user_model()

############
# Fixtures #
############

@pytest.fixture
def user():
    return User.objects.create_user(
        first_name="test_first_name1",
        last_name="test_last_name1",
        email="test1@example.com",
        password="password123"
    )

@pytest.fixture
def group(user):
    return Group.objects.create(
        name='Test Group 1',
        location='Test Location 1',
        description='Test Description 1',
        user=user
    )

@pytest.fixture
def tank(group):
    return Tank.objects.create(
        name='Test Tank 1',
        description='Test Description 1',
        type=TankType.STORAGE,
        capacity=100,
        is_active=True,
        group=group
    )

@pytest.fixture
def sensor(tank):
    return Sensor.objects.create(
        name='Test Sensor 1',
        description='Test Description 1',
        notes='Test Notes 1',
        device_id='TEST001',
        status=SensorStatus.IDLE,
        installation_date=date.today(),
        maintenance_date=date.today() + timedelta(days=30),
        is_active=True,
        tank=tank
    )

@pytest.fixture
def measure(sensor):
    return Measure.objects.create(
        label='test_measure',
        name='Test Measure',
        description='Test Description',
        type=MeasureType.TEMPERATURE,
        sensor=sensor
    )

@pytest.fixture
def channel(measure):
    return Channel.objects.create(
        label='test_channel',
        version='1.0',
        unit='celsius',
        rate=1.0,
        measure=measure
    )

@pytest.fixture
def chunk(measure):
    return Chunk.objects.create(
        measure=measure,
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=1)
    )

@pytest.fixture
def record(channel, chunk):
    return Record.objects.create(
        time=timezone.now(),
        value=23.5,
        channel=channel,
        chunk=chunk
    )

################
# Measure Tests #
################

@pytest.mark.django_db
class TestMeasureModel:
    
    def test_measure_creation(self, sensor):
        """Test basic measure creation with all fields"""
        measure = Measure.objects.create(
            label='test_measure',
            name='Test Measure',
            description='Test Description',
            type=MeasureType.TEMPERATURE,
            sensor=sensor
        )
        assert measure.label == 'test_measure'
        assert measure.name == 'Test Measure'
        assert measure.description == 'Test Description'
        assert measure.type == MeasureType.TEMPERATURE
        assert measure.sensor == sensor

    def test_measure_str_representation(self, measure):
        """Test the string representation of a measure"""
        assert str(measure) == 'Test Measure (test_measure)'

    def test_measure_unique_label_per_sensor(self, sensor, measure):
        """Test that measure labels must be unique per sensor"""
        with pytest.raises(IntegrityError):
            Measure.objects.create(
                label=measure.label,
                name='Different Measure',
                type=MeasureType.PRESSURE,
                sensor=sensor
            )

    def test_measure_types(self, sensor):
        """Test all possible measure types"""
        for measure_type in MeasureType.choices:
            measure = Measure.objects.create(
                label=f'measure_{measure_type[0]}',
                name=f'Measure {measure_type[0]}',
                type=measure_type[0],
                sensor=sensor
            )
            assert measure.type == measure_type[0]

    def test_measure_blank_description(self, sensor):
        """Test that description can be blank"""
        measure = Measure.objects.create(
            label='test_measure_blank',
            name='Test Measure',
            description='',
            type=MeasureType.TEMPERATURE,
            sensor=sensor
        )
        assert measure.description == ''

################
# Channel Tests #
################

@pytest.mark.django_db
class TestChannelModel:
    
    def test_channel_creation(self, measure):
        """Test basic channel creation with all fields"""
        channel = Channel.objects.create(
            label='test_channel',
            version='1.0',
            unit='celsius',
            rate=1.0,
            measure=measure
        )
        assert channel.label == 'test_channel'
        assert channel.version == '1.0'
        assert channel.unit == 'celsius'
        assert channel.rate == 1.0
        assert channel.measure == measure

    def test_channel_str_representation(self, channel):
        """Test the string representation of a channel"""
        assert str(channel) == 'test_channel (celsius)'

    def test_channel_rate_validation(self, measure):
        """Test that rate must be positive"""
        from django.db import transaction

        with pytest.raises(ValidationError):
            with transaction.atomic():
                channel = Channel.objects.create(
                    label='test_channel',
                    version='1.0',
                    unit='celsius',
                    rate=-1.0,
                    measure=measure
                )
                channel.full_clean()

###############
# Chunk Tests #
###############

@pytest.mark.django_db
class TestChunkModel:
    
    def test_chunk_creation(self, measure):
        """Test basic chunk creation with all fields"""
        start_time = timezone.now()
        end_time = start_time + timedelta(hours=1)
        chunk = Chunk.objects.create(
            measure=measure,
            start_time=start_time,
            end_time=end_time
        )
        assert chunk.measure == measure
        assert chunk.start_time == start_time
        assert chunk.end_time == end_time

    def test_chunk_str_representation(self, chunk):
        """Test the string representation of a chunk"""
        expected = f"{chunk.measure.label}: {chunk.start_time} - {chunk.end_time}"
        assert str(chunk) == expected

    def test_chunk_time_validation(self, measure):
        """Test that end_time must be after start_time"""
        start_time = timezone.now()
        end_time = start_time - timedelta(hours=1)
        
        with pytest.raises(ValidationError):
            chunk = Chunk.objects.create(
                measure=measure,
                start_time=start_time,
                end_time=end_time
            )
            chunk.full_clean()

################
# Record Tests #
################

@pytest.mark.django_db
class TestRecordModel:
    
    def test_record_creation(self, channel, chunk):
        """Test basic record creation with all fields"""
        time = timezone.now()
        record = Record.objects.create(
            time=time,
            value=23.5,
            channel=channel,
            chunk=chunk
        )
        assert record.time == time
        assert record.value == 23.5
        assert record.channel == channel
        assert record.chunk == chunk

    def test_record_str_representation(self, record):
        """Test the string representation of a record"""
        assert str(record) == f"Record(id={record.id}, value={record.value})"

    def test_record_timescale_interval(self):
        """Test that TimescaleDB interval is set correctly"""
        assert Record._meta.get_field('time').interval == "1 hour"

    def test_record_cascade_deletion(self, record, chunk):
        """Test that deleting a chunk cascades to records"""
        record_id = record.id
        chunk.delete()
        assert not Record.objects.filter(id=record_id).exists()