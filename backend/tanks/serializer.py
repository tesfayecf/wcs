from rest_framework import serializers
from .models import Tank, TankGroup


class TankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('id', 'name', 'capacity', 'isActive', 'dimensions',
                  'material', 'brand', 'tankGroup', 'type')


class CreateTankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('name', 'capacity', 'type', 
                  'dimensions', 'brand', 'material')


class TankGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TankGroup
        fields = ('id', 'name', 'location')


class CreateTankGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TankGroup
        fields = ('name', 'location', "description")
