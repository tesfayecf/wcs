from rest_framework import serializers
from .models import Tank, TankGroup


class TankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('id', 'name', 'capacity', 'isActive', 'x', 'y', 'z',
                  'material', 'brandName', 'tankGroup')


class CreateTankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('name', 'capacity', 'isActive', 'x', 'y', 'z',
                  'material', 'brandName', 'tankGroup')


class TankGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TankGroup
        fields = ('id', 'name', 'location', 'isActive')


class CreateTankGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TankGroup
        fields = ('name', 'location', 'isActive')
