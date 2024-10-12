from rest_framework import serializers

from users.models import User
from .models import Group, Tank, TankType, SensorStatus, SensorType

###############
### GROUP ### 
###############

class GroupSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

class GroupInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, read_only=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    total_tanks = serializers.IntegerField(read_only=True)
    total_active_tanks = serializers.IntegerField(read_only=True)
    total_sensors = serializers.IntegerField(read_only=True)
    total_active_sensors = serializers.IntegerField(read_only=True)
    max_capacity = serializers.IntegerField(read_only=True)
    current_capacity = serializers.IntegerField(read_only=True)
    average_capacity = serializers.FloatField()

class CreateGroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

class GetGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=True)

class GetGroupInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=True)

class GetGroupStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=True)

class UpdateGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    location = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(allow_blank=True, required=False)

class DeleteGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField()

###############
### TANK ### 
###############

class TankSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=TankType.choices)
    capacity = serializers.IntegerField(min_value=0)
    is_active = serializers.BooleanField(default=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class TankInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, read_only=True)
    type = serializers.ChoiceField(choices=TankType.choices, read_only=True)
    capacity = serializers.IntegerField(min_value=0, read_only=True)
    is_active = serializers.BooleanField(default=True, read_only=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    total_sensors = serializers.IntegerField(read_only=True)
    total_active_sensors = serializers.IntegerField(read_only=True)

class CreateTankSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=TankType.choices)
    capacity = serializers.IntegerField(min_value=0)
    is_active = serializers.BooleanField(default=True)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class GetTankSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

class GetTanksSerializer(serializers.Serializer):
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class GetTankInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

class UpdateTankSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    type = serializers.ChoiceField(choices=TankType.choices, required=False)
    capacity = serializers.IntegerField(min_value=0, required=False)
    is_active = serializers.BooleanField(required=False)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class DeleteTankSerializer(serializers.Serializer):
    id = serializers.IntegerField()

###############
### SENSOR ### 
###############

class SensorSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    notes = serializers.CharField(allow_blank=True)
    device_id = serializers.CharField(max_length=100)
    type = serializers.ChoiceField(choices=SensorType.choices)
    status = serializers.ChoiceField(choices=SensorStatus.choices)
    installation_date = serializers.DateField(required=False, allow_null=True)
    maintenance_date = serializers.DateField(required=False, allow_null=True)
    is_active = serializers.BooleanField(default=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

class CreateSensorSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    notes = serializers.CharField(allow_blank=True)
    device_id = serializers.CharField(max_length=100)
    type = serializers.ChoiceField(choices=SensorType.choices)
    status = serializers.ChoiceField(choices=SensorStatus.choices)
    installation_date = serializers.DateField(required=False, allow_null=True)
    maintenance_date = serializers.DateField(required=False, allow_null=True)
    is_active = serializers.BooleanField(default=True)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

class GetSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

class GetSensorsSerializer(serializers.Serializer):
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

class UpdateSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    notes = serializers.CharField(allow_blank=True, required=False)
    device_id = serializers.CharField(max_length=100, required=False)
    type = serializers.ChoiceField(choices=SensorType.choices, required=False)
    status = serializers.ChoiceField(choices=SensorStatus.choices, required=False)
    installation_date = serializers.DateField(required=False)
    maintenance_date = serializers.DateField(required=False)
    is_active = serializers.BooleanField(required=False)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

class DeleteSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField()