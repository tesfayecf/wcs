from rest_framework import serializers
from .models import Tank, Group


class TankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('id', 'name', 'capacity', 'isActive', 'dimensions',
                  'material', 'brand', 'group', 'type')


class CreateTankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tank
        fields = ('name', 'capacity', 'type', 
                  'dimensions', 'brand', 'material')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name', 'location')


class CreateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name', 'location', "description")
