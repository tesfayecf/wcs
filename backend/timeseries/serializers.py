from rest_framework import serializers

from resources.models import Sensor
from .models import Measure, MeasureType, Channel, Chunk, Record

###############
### MEASURE ### 
###############

class MeasureSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    label = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=[(tag.value, tag.name) for tag in MeasureType])
    sensor = serializers.PrimaryKeyRelatedField(queryset=Sensor.objects.all())

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'label': instance.label,
            'name': instance.name,
            'description': instance.description,
            'type': instance.type,
            'sensor': instance.sensor,
        }

    class Meta:
        model = Measure
        fields = '__all__'

class GetMeasuerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

class GetMeasuresSerializer(serializers.Serializer):
    sensor = serializers.PrimaryKeyRelatedField(queryset=Sensor.objects.all())

###############
### CHANNEL ### 
###############

class ChannelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    label = serializers.CharField(max_length=50)
    version = serializers.CharField(max_length=20)
    unit = serializers.CharField(max_length=20)
    rate = serializers.FloatField()
    measure = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all())

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'label': instance.label,
            'version': instance.version,
            'unit': instance.unit,
            'rate': instance.rate,
            'measure': instance.measure,
        }

    class Meta:
        model = Channel
        fields = '__all__'

class GetChannelSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

class GetChannelsSerializer(serializers.Serializer):
    measure = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all())

#############
### CHUNK ### 
#############

class ChunkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    measure = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all())
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'measure': instance.measure.id,
            'start_time': instance.start_time.isoformat(),
            'end_time': instance.end_time.isoformat(),
        }

    class Meta:
        model = Chunk
        fields = '__all__'

##############
### RECORD ### 
##############

class TimeframeChoices(serializers.ChoiceField):
    def __init__(self, **kwargs):
        choices = (
            ('minute', 'minute'),
            ('hour', 'hour'),
            ('day', 'day'),
            ('week', 'week'),
            ('month', 'month'),
            ('year', 'year'),
        )
        super().__init__(choices=choices, **kwargs)

class RecordSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    value = serializers.FloatField()
    channel = serializers.PrimaryKeyRelatedField(queryset=Channel.objects.all())
    chunk = serializers.PrimaryKeyRelatedField(queryset=Chunk.objects.all())
    measure = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all(), required=False)
    time = serializers.DateTimeField()

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'value': instance.value,
            'channel': instance.channel,
            'chunk': instance.chunk,
            'measure': instance.measure,
            'time': instance.time,
        }

    class Meta:
        model = Record
        fields = '__all__'

class RecordInfoSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField()
    min = serializers.FloatField()
    max = serializers.FloatField()
    value = serializers.FloatField()
    channel = serializers.PrimaryKeyRelatedField(queryset=Channel.objects.all(), required=False)
    measure = serializers.PrimaryKeyRelatedField(queryset=Measure.objects.all(), required=False)
    sensor = serializers.PrimaryKeyRelatedField(queryset=Sensor.objects.all())

    def to_representation(self, instance):
        return {
            'time': instance['time'],
            'min': instance['min'],
            'max': instance['max'],
            'value': instance['value'],
            'channel': instance['channel'],
            'measure': instance['measure'],
            'sensor': instance['sensor'],
        }
    
    class Meta:
        model = Record
        fields = '__all__'

class GetLastRecordSerializer(serializers.Serializer):
    measuer_id = serializers.IntegerField()
    sensor_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    tank_id = serializers.IntegerField()

class GetRecordsSerializer(serializers.Serializer):
    tank_id = serializers.IntegerField(required=False)
    group_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    timeframe = TimeframeChoices()

###################
### RECORD FLOW ### 
###################

class RecordFlowSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    input_flow = serializers.FloatField()
    output_flow = serializers.FloatField()
    net_change = serializers.FloatField()

    def to_representation(self, instance):
        return {
            'time': instance['time'],
            'input_flow': instance['input_flow'],
            'output_flow': instance['output_flow'],
            'net_change': instance['net_change'],
        }

class GetRecordsFlowSerializer(serializers.Serializer):
    measure_id = serializers.IntegerField(required=False)
    sensor_id = serializers.IntegerField(required=False)
    tank_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    timeframe = TimeframeChoices()

#############################
### RECORD TREND FORECAST ### 
#############################

class RecordTrendForecastSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    value = serializers.FloatField()

    def to_representation(self, instance):
        return {
            'time': instance['time'],
            'value': instance['value'],
        }

class GetRecordsTrendForecastSerializer(serializers.Serializer):
    measure_id = serializers.IntegerField(required=False)
    sensor_id = serializers.IntegerField(required=False)
    tank_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    timeframe = TimeframeChoices()
