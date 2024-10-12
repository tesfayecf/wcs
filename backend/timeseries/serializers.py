from rest_framework import serializers
from .models import SensorReading, SensorLog, SensorStatus

class SensorReadingSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    distance = serializers.FloatField(required=False, allow_null=True)
    time = serializers.DateTimeField(required=False)  # Assuming you want to allow setting time
    sensor = serializers.PrimaryKeyRelatedField(queryset=SensorReading.objects.all())

    def create(self, validated_data):
        return SensorReading.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.distance = validated_data.get('distance', instance.distance)
        instance.time = validated_data.get('time', instance.time)
        instance.sensor = validated_data.get('sensor', instance.sensor)
        instance.save()
        return instance

class SensorLogSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.ChoiceField(choices=[(status.value, status.label) for status in SensorStatus])
    status_message = serializers.CharField(required=False, allow_blank=True)
    signal_strength = serializers.IntegerField(required=False, allow_null=True)
    battery_voltage = serializers.FloatField(required=False, allow_null=True)
    battery_percentage = serializers.IntegerField(required=False, allow_null=True)
    time = serializers.DateTimeField(required=False)  # Assuming you want to allow setting time
    sensor = serializers.PrimaryKeyRelatedField(queryset=SensorLog.objects.all())

    def create(self, validated_data):
        return SensorLog.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.status_message = validated_data.get('status_message', instance.status_message)
        instance.signal_strength = validated_data.get('signal_strength', instance.signal_strength)
        instance.battery_voltage = validated_data.get('battery_voltage', instance.battery_voltage)
        instance.battery_percentage = validated_data.get('battery_percentage', instance.battery_percentage)
        instance.time = validated_data.get('time', instance.time)
        instance.sensor = validated_data.get('sensor', instance.sensor)
        instance.save()
        return instance