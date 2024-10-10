from enum import Enum
from django.utils import timezone
from rest_framework.serializers import Serializer, CharField, DateTimeField, IntegerField, ChoiceField, ListField, FloatField, BooleanField

# Base serializer class for common functionality
class BaseSerializer(Serializer):
    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return validated_data

# Serializers for Group-related operations
class GroupSerializers:
    # Serializer for Group model representation
    class Group(BaseSerializer):
        id = IntegerField(read_only=True)
        name = CharField()
        location = CharField()
        description = CharField()
        date_created = DateTimeField(default=timezone.now, read_only=True)
        date_modified = DateTimeField(default=timezone.now, read_only=True)

    # Serializer for retrieving a single group
    class Get(BaseSerializer):
        id = IntegerField()

    # Serializer for creating a new group
    class Create(BaseSerializer):
        name = CharField()
        location = CharField()
        description = CharField()

    # Serializer for editing an existing group
    class Edit(BaseSerializer):
        id = IntegerField()
        name = CharField()
        location = CharField()
        description = CharField()

    # Serializer for deleting a group
    class Delete(BaseSerializer):
        id = IntegerField()

    # Serializer for group statistics
    class Stats(BaseSerializer):
        id = IntegerField()
        name = CharField()
        time = ListField(child=IntegerField())
        inflow = ListField(child=FloatField())
        outflow = ListField(child=FloatField())
        savings = ListField(child=FloatField())

    # Serializer for group status
    class Status(BaseSerializer):
        id = IntegerField()
        name = CharField()
        level = FloatField()
        capacity = FloatField()

    # Serializer for group water level
    class Level(BaseSerializer):
        id = IntegerField()
        name = CharField()
        time = ListField(child=IntegerField())
        level = ListField(child=FloatField())

# Enum for Tank types
class TankType(str, Enum):
    STORAGE = 'Storage'
    WELL = 'Well'
    RESERVOIR = 'Reservoir'
    TANK = 'Tank'
    OTHER = 'Other'

# Serializers for Tank-related operations
class TankSerializers:
    # Serializer for Tank model representation
    class Tank(BaseSerializer):
        id = IntegerField(read_only=True)
        name = CharField()
        type = ChoiceField(choices=[(t.name, t.value) for t in TankType])
        capacity = IntegerField()
        is_active = BooleanField()
        date_created = DateTimeField(default=timezone.now, read_only=True)
        date_modified = DateTimeField(default=timezone.now, read_only=True)

    # Serializer for retrieving a single tank
    class Get(BaseSerializer):
        id = IntegerField()
        group_id = IntegerField()

    # Serializer for retrieving all tanks in a group
    class GetAll(BaseSerializer):
        group_id = IntegerField()

    # Serializer for creating a new tank
    class Create(BaseSerializer):
        name = CharField()
        type = ChoiceField(choices=[(t.name, t.value) for t in TankType])
        capacity = IntegerField()
        group_id = IntegerField()

    # Serializer for editing an existing tank
    class Edit(BaseSerializer):
        id = IntegerField()
        name = CharField()
        type = ChoiceField(choices=[(t.name, t.value) for t in TankType])
        capacity = IntegerField()
        is_active = BooleanField()
        group_id = IntegerField()

    # Serializer for deleting a tank
    class Delete(BaseSerializer):
        id = IntegerField()
        group_id = IntegerField()

    # Serializer for tank statistics
    class Stats(BaseSerializer):
        id = IntegerField()
        name = CharField()
        inflow = ListField(child=IntegerField())
        outflow = ListField(child=IntegerField())
        savings = ListField(child=IntegerField())

    # Serializer for tank water level
    class Level(BaseSerializer):
        id = IntegerField()
        name = CharField()
        level = ListField(child=IntegerField())

    # Serializer for tank status
    class Status(BaseSerializer):
        id = IntegerField()
        name = CharField()
        level = IntegerField()
        capacity = IntegerField()
        is_active = BooleanField()
        has_sensors = BooleanField()

# Serializers for Sensor-related operations
class SensorSerializers:
    # Serializer for Sensor model representation
    class Sensor(BaseSerializer):
        id = IntegerField(read_only=True)
        sensor_id = CharField()
        is_active = BooleanField()
        date_created = DateTimeField(default=timezone.now, read_only=True)
        date_modified = DateTimeField(default=timezone.now, read_only=True)

    # Serializer for retrieving a single sensor
    class Get(BaseSerializer):
        tank_id = IntegerField()
        group_id = IntegerField()

    # Serializer for creating a new sensor
    class Create(BaseSerializer):
        sensor_id = CharField()
        tank_id = IntegerField()
        group_id = IntegerField()

    # Serializer for editing an existing sensor
    class Edit(BaseSerializer):
        id = IntegerField()
        sensor_id = CharField()
        is_active = BooleanField()
        tank_id = IntegerField()
        group_id = IntegerField()

    # Serializer for deleting a sensor
    class Delete(BaseSerializer):
        sensor_id = IntegerField()
        tank_id = IntegerField()
        group_id = IntegerField()

# Serializers for general information and summaries
class InfoSerializers:
    # Serializer for statistics summary
    class Stats(BaseSerializer):
        stats = GroupSerializers.Stats(many=True)

    # Serializer for overall summary
    class Summary(BaseSerializer):
        status = GroupSerializers.Stats(many=True)
        level = GroupSerializers.Stats(many=True)