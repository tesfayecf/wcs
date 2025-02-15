from rest_framework import serializers

from .models import Group, Tank, TankType, Sensor, SensorStatus
from users.models import User
from timeseries.models import Measure, Channel, Record

#############
### GROUP ### 
#############

class GroupSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'location': instance.location,
            'description': instance.description,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'user': instance.user.id
        }

    class Meta:
        model = Group
        fields = '__all__'

class GroupInfoSerializer(serializers.ModelSerializer):
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

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'location': instance.location,
            'description': instance.description,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'total_tanks': instance.tanks.count(),
            'total_active_tanks': instance.tanks.filter(is_active=True).count(),
            'total_sensors': instance.sensors.count(),
            'total_active_sensors': instance.sensors.filter(status=SensorStatus.OPERATIONAL).count(),
            'max_capacity': instance.max_capacity,
            'current_capacity': instance.current_capacity,
            'average_capacity': instance.average_capacity
        }

    class Meta:
        model = Group
        fields = '__all__'

class CreateGroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    location = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)

class GetGroupSerializer(serializers.Serializer):
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class GetGroupInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)

class GetGroupMetricsSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)

class UpdateGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    location = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(allow_blank=True, required=False)

class DeleteGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField()

############
### TANK ### 
############

class TankSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=TankType.choices)
    capacity = serializers.IntegerField(min_value=0)
    is_active = serializers.BooleanField(default=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'description': instance.description,
            'type': instance.type,
            'capacity': instance.capacity,
            'is_active': instance.is_active,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'group': instance.group.id
        }

    class Meta:
        model = Tank
        fields = '__all__'

class TankInfoSerializer(serializers.ModelSerializer):
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

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'description': instance.description,
            'type': instance.type,
            'capacity': instance.capacity,
            'is_active': instance.is_active,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'total_sensors': instance.sensors.count(),
            'total_active_sensors': instance.sensors.filter(status=SensorStatus.OPERATIONAL).count()
        }

    class Meta:
        model = Tank
        fields = '__all__'

class CreateTankSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=TankType.choices)
    capacity = serializers.IntegerField(min_value=0)
    is_active = serializers.BooleanField(default=True)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

class GetTankSerializer(serializers.Serializer):
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

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

##############
### SENSOR ### 
##############

class SensorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    notes = serializers.CharField(allow_blank=True)
    device_id = serializers.CharField(max_length=100)
    status = serializers.ChoiceField(choices=SensorStatus.choices)
    installation_date = serializers.DateField(required=False, allow_null=True)
    maintenance_date = serializers.DateField(required=False, allow_null=True)
    is_active = serializers.BooleanField(default=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'description': instance.description,
            'notes': instance.notes,
            'device_id': instance.device_id,
            'status': instance.status,
            'installation_date': instance.installation_date,
            'maintenance_date': instance.maintenance_date,
            'is_active': instance.is_active,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'tank': instance.tank
        }

    class Meta:
        model = Sensor
        fields = '__all__'

class SensorInfoSerializer(serializers.ModelSerializer): 
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, read_only=True)
    notes = serializers.CharField(allow_blank=True, read_only=True)
    device_id = serializers.CharField(max_length=100, read_only=True)
    status = serializers.ChoiceField(choices=SensorStatus.choices, read_only=True)
    installation_date = serializers.DateField(read_only=True)
    maintenance_date = serializers.DateField(read_only=True)
    is_active = serializers.BooleanField(default=True, read_only=True)
    edited_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())
    num_measures = serializers.IntegerField(read_only=True)
    num_channels = serializers.IntegerField(read_only=True)
    num_records = serializers.IntegerField(read_only=True)
    last_record = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'description': instance.description,
            'notes': instance.notes,
            'device_id': instance.device_id,
            'status': instance.status,
            'installation_date': instance.installation_date,
            'maintenance_date': instance.maintenance_date,
            'is_active': instance.is_active,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'tank': instance.tank,
            'num_measures': Measure.objects.filter(sensor=instance).count(),
            'num_channels': Channel.objects.filter(measure__sensor=instance).count(),
            'num_records': Record.objects.filter(measure__channel__sensor=instance).count(),
            'last_record': Record.objects.filter(sensor=instance).order_by('-created_at').first().created_at
        }
    
    class Meta:
        model = Sensor
        fields = '__all__'

class CreateSensorSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    notes = serializers.CharField(allow_blank=True)
    device_id = serializers.CharField(max_length=100)
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
    status = serializers.ChoiceField(choices=SensorStatus.choices, required=False)
    installation_date = serializers.DateField(required=False)
    maintenance_date = serializers.DateField(required=False)
    is_active = serializers.BooleanField(required=False)
    tank = serializers.PrimaryKeyRelatedField(queryset=Tank.objects.all())

class DeleteSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField()