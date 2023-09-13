from .models import Tank, Group
from sensors.models import TankSensor, Sensor

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializer import TankSerializer, GroupSerializer, CreateTankSerializer, CreateGroupSerializer
from utils.serialization.serialize_model import serialize_model, serialize_model_array


class GetSummaryView(generics.ListAPIView):
    serializer_class = TankSerializer

    def post(self, request):
        return Response({}, status=status.HTTP_200_OK)


#############
### GROUP ###
#############

class GetGroupsView(generics.ListAPIView):
    def post(self, request):
        user = request.user
        groups = Group.objects.filter(user=user)
        groups_s = serialize_model_array(groups, ['id', 'name', 'location', 'description'])
        if not groups_s:
            return Response([], status=status.HTTP_200_OK)
        else:
            return Response(groups_s, status=status.HTTP_200_OK)
        
class CreateGroupView(APIView):
    serializer_class = CreateGroupSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            location = serializer.validated_data.get('location')
            description = serializer.validated_data.get('description')

            query_name = Group.objects.filter(name=name)

            if not query_name.exists():
                tank_group = Group(name=name, location=location, description=description, user=request.user)
                tank_group.save()
                return Response(serialize_model(tank_group, ['id', 'name', 'location']), status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class EditGroupView(APIView):
    def post(self, request):
        tank_group = getGroup(request=request)
        serializer = GroupSerializer(tank_group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
            
class DeleteGroupView(APIView):
    def post(self, request, pk):
        tank_group = getGroup(request=request)
        tank_group.delete()
        return Response({"message": "Group deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class GetGroupTanksView(APIView):
    def post(self, request):
        tank_group = getGroup(request=request)
        tank_group_data = serialize_model(tank_group, ['id', 'name', 'location'])

        tanks = tank_group.tanks.all()
        tanks_data = []
        for tank in tanks:
            tank_data = serialize_model(tank, ['id', 'name', 'capacity', 'isActive', 'dimensions', 'material', 'brand', 'type'])
            tank_data['hasSensor'] = tank.has_sensor_assigned()
            tanks_data.append(tank_data)
        
        data = {
            "group": tank_group_data,
            'tanks': tanks_data,
        }
        # # add stats data
        data['groupStats'] = {
            'totalTanks': tank_group.total_tanks(),
            'averageWaterLevel': 0,
        #     'minWaterLevel': tank_group.min_water_level,
            'minWaterLevel': 0,
        #     'maxWaterLevel': tank_group.max_water_level,
            'maxWaterLevel': 0,
            'totalCapacity': tank_group.get_total_capacity(),
            # 'totalCapacity': 0,
        }

        return Response(data, status=status.HTTP_200_OK)

class GetGroupStatsView(APIView):
    def post(self, request):
        tank_group = getGroup(request=request)
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

def getGroup(request):
    user = request.user
    groupId = request.data.get('groupId')
    group = Group.objects.get(pk=groupId, user=user)
    if not group:
        return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
    if group.user != request.user:
        return Response({"error": "You don't have permission to acces this group."},
                        status=status.HTTP_403_FORBIDDEN)
    return group


############
### TANK ###
############

class GetTankView(APIView):
    def post(self, request):
        tank, tank_group = getTank(request=request)
        # tank_s = TankSerializer(tank)
        try:
            data = serialize_model(tank)
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateTankView(APIView):
    def post(self, request):
        group = getGroup(request=request)
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
                    group=group,
                    isActive=isActive,
                )
                tank.save()
                return Response(TankSerializer(tank).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class EditTankView(APIView):
    def post(self, request):
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
    def post(self, request):
        try:
            tank, _ = getTank(request=request)
            tank.delete()
            return Response({"message": "Tank deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Tank.DoesNotExist:
            return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)

class GetTankStatsView(APIView):
    def post(self, request):
        tank, _ = getTank(request=request)
        data = {
            # 'total_sensor': tank.total_sensors(),
            # 'total_active_sensors': tank.total_active_sensors(),
            # 'average_water_level': tank.average_water_level,
            # 'min_water_level': tank.min_water_level,
            # 'max_water_level': tank.max_water_level,
            # 'get_latest_sensor_data': tank.get_latest_sensor_data(),
            # 'get_oldest_sensor_data': tank.get_oldest_sensor_data(),
        }
        return Response(data, status=status.HTTP_200_OK)

class GetSensorView(APIView):
    def post(self, request):
        tank, _ = getTank(request=request)
        try: 
            if tank.has_sensor_assigned():
                relation = tank.tank_sensor.filter(is_active=True).first()
                data = serialize_model(relation.sensor, ["id", "serial_number", "manufacturer", "model", "is_active"])
                if data:
                    data['tank'] = {
                        'name': tank.name,
                        'id': tank.id,
                    }
                    return Response(data, status=status.HTTP_200_OK)   
                else:
                    raise Exception("Serilization error")
            else:
                raise Exception("Sensor not found")
        except: 
            data = {
                'id': "-1",
                'serial_number': "-1",
                'manufacturer': "",
                'model': "",
                'is_active': False,
            }
            return Response(data, status=status.HTTP_200_OK)


class AssignSensorView(APIView):
    # each tank can only have one sensor assigned. We create a row in the table were one column is a tank and the other a sensor.
    def post(self, request):
        tank, _ = getTank(request=request)
        serialNumber = request.data.get('serialNumber')
        sensor = Sensor.objects.get(serial_number=serialNumber)
        if not sensor:
            return Response({"error": "Sensor not found."}, status=status.HTTP_404_NOT_FOUND)
        relation = TankSensor.objects.filter(tank=tank) | TankSensor.objects.filter(sensor=sensor)
        if relation:
            return Response({"error": "This sensor is already assigned to this tank."}, status=status.HTTP_400_BAD_REQUEST)
        tanksensor = TankSensor(sensor=sensor, tank=tank)
        tanksensor.save()
        return Response({}, status=status.HTTP_200_OK)



def getTank(request):
    user = request.user
    tankId = request.data.get('tankId')
    groupId = request.data.get('groupId')
    group = Group.objects.get(pk=groupId, user=user)
    if not group:
        return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
    tank = Tank.objects.get(pk=tankId, group=group)
    if not tank:
        return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)
    if tank.group != group:
        return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)
    if group.user != request.user:
        return Response({"error": "You don't have permission to acces this group."},
                        status=status.HTTP_403_FORBIDDEN)
    return tank, group