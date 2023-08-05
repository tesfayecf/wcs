import json
from django.conf import settings
from django.http import HttpResponse
from .models import Tank, TankGroup
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializer import TankSerializer, TankGroupSerializer, CreateTankSerializer, CreateTankGroupSerializer
from utils.serialization.deserialize_model import deserialize_model


##################
### TANK GROUP ###
##################

class GetTankGroupsView(generics.ListAPIView):
    serializer_class = TankGroupSerializer

    def get(self, request):
        user = request.user
        userTankGroups = TankGroup.objects.filter(user=user)
        userTankGroups_s = TankGroupSerializer(userTankGroups, many=True)
        if userTankGroups_s.data:
            return Response(userTankGroups_s.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)
        
class CreateTankGroupView(APIView):
    serializer_class = CreateTankGroupSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            location = serializer.validated_data.get('location')
            description = serializer.validated_data.get('description')

            query_name = TankGroup.objects.filter(name=name)

            if not query_name.exists():
                tank_group = TankGroup(name=name, location=location, description=description, user=request.user)
                tank_group.save()
                return Response(TankGroupSerializer(tank_group).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class EditTankGroupView(APIView):
    def put(self, request):
        tank_group = getTankGroup(request=request)
        serializer = TankGroupSerializer(tank_group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
            
class DeleteTankGroupView(APIView):
    def delete(self, request, pk):
        tank_group = getTankGroup(request=request)
        tank_group.delete()
        return Response({"message": "TankGroup deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class GetTankGroupTanks(APIView):
    def post(self, request):
        tank_group = getTankGroup(request=request)
        if tank_group is None:
            return Response({"error": "TankGroup not found."}, status=status.HTTP_400_BAD_REQUEST)

        tank_group_s = TankGroupSerializer(tank_group)
        tank_group_tanks = TankSerializer(tank_group.tanks, many=True)
        data = {
            "tankGroup": tank_group_s.data,
            'tanks': tank_group_tanks.data,
        }
        # add stats data
        data['tankGroupStats'] = {
            'totalTanks': tank_group.total_tanks(),
            'averageWaterLevel': tank_group.average_water_level(),
            'minWaterLevel': tank_group.min_water_level,
            'maxWaterLevel': tank_group.max_water_level,
            'totalCapacity': tank_group.get_total_capacity(),
        }

        return Response(data, status=status.HTTP_200_OK)

class GetTankGroupStatsView(APIView):
    def get(self, request):
        tank_group = getTankGroup(request=request)
        data = {
            'total_tanks': tank_group.total_tanks(),
            'average_water_level': tank_group.total_active_tanks(),
            'total_sensor_data': tank_group.total_sensor_data(),
            'average_water_level': tank_group.average_water_level(),
            'min_water_level': tank_group.min_water_level,
            'max_water_level': tank_group.max_water_level,
            'average_temperature': tank_group.average_temperature,
        }
        return Response(data, status=status.HTTP_200_OK)

def getTankGroup(request):
    user = request.user

    # Read the request body and parse it as JSON
    try:
        data = json.loads(request.body)
        tankGroupId = data.get('tankGroupId')
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON data in the request body."}, status=400)

    try:
        tankGroup = TankGroup.objects.get(pk=tankGroupId)
        if tankGroup.user != user:
            return Response({"error": "You don't have permission to access this TankGroup."},
                                status=403)
        return tankGroup
    except TankGroup.DoesNotExist:
        return Response({"error": "TankGroup not found."}, status=404)


############
### TANK ###
############


class GetTankView(APIView):
    def get(self, request):
        tank, tank_group = getTank(request=request)
        # tank_s = TankSerializer(tank)
        try:
            data = deserialize_model(tank)
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateTankView(APIView):
    def post(self, request):
        tank_group = getTankGroup(request=request)
        data_s = CreateTankSerializer(data=request.data)
        if data_s.is_valid():
            name = data_s.data.get('name')
            capacity = data_s.data.get('capacity')
            dimensions = data_s.data.get('dimensions')
            type = data_s.data.get('type')
            material = data_s.data.get('material')
            brand = data_s.data.get('brand')
            isActive = True

            queryName = Tank.objects.filter(name=name)

            if len(queryName) == 0:
                tank = Tank(
                    name=name,
                    capacity=capacity,
                    dimensions=dimensions,
                    material=material,
                    brand=brand,
                    type=type,
                    tankGroup=tank_group,
                    isActive=isActive,
                )
                tank.save()
                return Response(TankSerializer(tank).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class EditTankView(APIView):
    def put(self, request):
        try:
            tank, _ = getTank(request=request)
            serializer = TankSerializer(tank, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Tank.DoesNotExist:
            return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)

class DeleteTankView(APIView):
    def delete(self, request):
        try:
            tank, _ = getTank(request=request)
            tank.delete()
            return Response({"message": "Tank deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Tank.DoesNotExist:
            return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)

class GetTankStatsView(APIView):
    def get(self, request):
        tank, _ = getTank(request=request)
        data = {
            'total_sensor': tank.total_sensors(),
            'total_active_sensors': tank.total_active_sensors(),
            'average_water_level': tank.average_water_level,
            'min_water_level': tank.min_water_level,
            'max_water_level': tank.max_water_level,
            'get_latest_sensor_data': tank.get_latest_sensor_data(),
            'get_oldest_sensor_data': tank.get_oldest_sensor_data(),
        }
        return Response(data, status=status.HTTP_200_OK)

class GetTankSensorsView(APIView):
    def post(self, request):
        tank, _ = getTank(request=request)
        try: 
            data = deserialize_model(tank.sensor, ["id", "name", "location", "serial_number", "manufacturer", "model", "is_active", "tank"])
            return Response(data, status=status.HTTP_200_OK)    
        except: 
            return Response({}, status=status.HTTP_200_OK)

def getTank(request):
    user = request.user
    tankId = request.data.get('tankId')
    tankGroupId = request.data.get('tankGroupId')
    tank_group = TankGroup.objects.get(pk=tankGroupId, user=user)
    if not tank_group:
        return Response({"error": "TankGroup not found."}, status=status.HTTP_404_NOT_FOUND)
    tank = Tank.objects.get(pk=tankId, tankGroup=tank_group)
    if not tank:
        return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)
    if tank.tankGroup != tank_group:
        return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)
    if tank_group.user != request.user:
        return Response({"error": "You don't have permission to acces this tankGroup."},
                        status=status.HTTP_403_FORBIDDEN)
    return tank, tank_group