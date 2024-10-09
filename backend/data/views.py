import random
from datetime import timedelta
from pydantic import ValidationError

from django.utils import timezone
from django.core.cache import cache
from django.db.models import Count, Sum, Q
from django.forms.models import model_to_dict

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .schemas import *
from .models import Tank, Group, Sensor
from .serializers import GroupSerializers

from timeseries.models import SensorReading

# Cache timeout in seconds (e.g., 5 minutes)
CACHE_TIMEOUT = 300

#############
### GROUP ###
#############


### GET ###
class GetGroupView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Get(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            cache_key = f"group_{serializer.validated_data['id']}"
            cached_group = cache.get(cache_key)

            if cached_group:
                group = cached_group
            else:
                group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).first()
                if not group:
                    return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
                cache.set(cache_key, group, timeout=CACHE_TIMEOUT)

            group_serializer = GroupSerializers.Group(group)
            return Response(group_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetGroupsView(APIView):
    def post(self, request):
        try:
            groups = Group.objects.filter(user=request.user)
            serializer = GroupSerializers.Group(groups, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateGroupView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Create(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            if Group.objects.filter(name=serializer.validated_data['name'], user=request.user).exists():
                return Response({'Bad Request': 'Group with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            group = Group.objects.create(user=request.user, **serializer.validated_data)
            
            response_serializer = GroupSerializers.Group(group)
            
            cache_key = f"group_{group.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###
class EditGroupView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Edit(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            remove_group_cache(serializer.validated_data['id'])

            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            for attr, value in serializer.validated_data.items():
                setattr(group, attr, value)
            group.save()

            cache_key = f"group_{group.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            response_serializer = GroupSerializers.Group(group)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### DELETE ###
class DeleteGroupView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Delete(data=request.data)
            serializer.is_valid(raise_exception=True)

            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            group.delete()
            remove_group_cache(serializer.validated_data['id'])
            
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### INFO ###
class GetGroupInfoView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Get(data=request.data)
            serializer.is_valid(raise_exception=True)

            cache_key = f"group_info_{serializer.validated_data['id']}"
            cached_info = cache.get(cache_key)

            if cached_info:
                return Response(cached_info, status=status.HTTP_200_OK)

            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).annotate(
                total_tanks=Count('tanks'),
                total_active_tanks=Count('tanks', filter=Q(tanks__is_active=True)),
                total_capacity=Sum('tanks__capacity'),
                total_active_capacity=Sum('tanks__capacity', filter=Q(tanks__is_active=True)),
                total_sensors=Count('tanks__sensor'),
                total_active_sensors=Count('tanks__sensor', filter=Q(tanks__sensor__is_active=True))
            ).first()

            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            info = {
                'total_tanks': group.total_tanks,
                'total_active_tanks': group.total_active_tanks,
                'total_capacity': group.total_capacity or 0,
                'total_active_capacity': group.total_active_capacity or 0,
                'total_sensors': group.total_sensors,
                'total_active_sensors': group.total_active_sensors,
            }

            cache.set(cache_key, info, timeout=CACHE_TIMEOUT)

            return Response(info, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### STATS ###
class GetGroupStatsView(APIView):
    def post(self, request):
        try:
            serializer = GroupSerializers.Get(data=request.data)
            serializer.is_valid(raise_exception=True)

            cache_key = f"group_stats_{serializer.validated_data['id']}_{request.user.id}"
            cached_stats = cache.get(cache_key)

            if cached_stats:
                return Response(cached_stats, status=status.HTTP_200_OK)

            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Implement get_stats() method on Group model or compute stats here
            stats = {}  # group.get_stats()

            cache.set(cache_key, stats, timeout=CACHE_TIMEOUT)

            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ###
def remove_group_cache(group_id: int):
    """Remove all cached information for a specific group."""
    cache_key_patterns = [
        f"group_{group_id}",
        f"group_info_{group_id}",
        f"group_stats_{group_id}",
    ]

    for key in cache_key_patterns:
        cache.delete(key)

def get_group(group_id: int, user) -> Group:
    """Check if the group exists in the cache and the database."""
    cache_key = f"group_{group_id}"

    try:
        cached_group = cache.get(cache_key)

        if cached_group:
            return cached_group  

        group = Group.objects.filter(pk=group_id, user=user).first()

        if group:
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)

        return group

    except Exception as e:
        print(f"Error retrieving group {group_id}: {e}")
        return None
    
############
### TANK ###
############

### GET ###
class GetTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_tank_data = GetTankSchema(**request.data)

            # Check if the group exists
            group = get_group(get_tank_data.group_id, request.user)
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve the tank
            tank = Tank.objects.filter(pk=get_tank_data.id, group__id=get_tank_data.group_id, group__user=request.user).first()
            if not tank:
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Serialize the tank
            tank_schema = TankSchema(**model_to_dict(tank))
            tank_json = tank_schema.model_dump()

            return Response(tank_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetTanksView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_tanks_data = GetTanksSchema(**request.data)

            # Check if the group exists
            group = get_group(get_tanks_data.group_id, request.user)
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the tanks in the group
            tanks = Tank.objects.filter(group__id=get_tanks_data.group_id, group__user=request.user)

            # Serialize tanks
            tanks_json = [TankSchema(**model_to_dict(tank)).model_dump() for tank in tanks]

            return Response(tanks_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            create_tank_data = CreateTankSchema(**request.data)

            # Check if the group exists
            group = get_group(create_tank_data.group_id, request.user)
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if a tank with the same name already exists

            if Tank.objects.filter(name=create_tank_data.name, group__id=create_tank_data.group_id, group__user=request.user).exists():
                return Response({'Bad Request': 'Tank with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create and save a new Tank object
            tank = Tank(
                name=create_tank_data.name,
                type=create_tank_data.type,
                capacity=create_tank_data.capacity,
                is_active=True,
                group=group,
            )
            tank.save()

            # Serialize the created tank
            tank_schema = TankSchema(**model_to_dict(tank))
            tank_json = tank_schema.model_dump()

            # Cache the data for future requests
            cache_key = f"tank_{tank_schema.id}"
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            return Response(tank_json, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###
class EditTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            edit_tank_data = EditTankSchema(**request.data)

            # Remove cache for this group's tanks
            remove_tanks_cache(edit_tank_data.group_id)

            # Check if the group exists
            group = get_group(edit_tank_data.group_id, request.user)
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if a tank with the same name already exists in the same group
            if Tank.objects.filter(name=edit_tank_data.name, group__id=edit_tank_data.group_id, group__user=request.user).exclude(pk=edit_tank_data.id).exists():
                return Response({'Bad Request': 'Tank with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve and update the tank
            tank = Tank.objects.filter(pk=edit_tank_data.id, group__id=edit_tank_data.group_id, group__user=request.user).first()
            if not tank:
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Update tank fields
            tank.name = edit_tank_data.name
            tank.type = edit_tank_data.type
            tank.capacity = edit_tank_data.capacity
            tank.save()

            # Serialize the edited tank
            tank_schema = TankSchema(**model_to_dict(tank))
            tank_json = tank_schema.model_dump()

            # Cache the data for future requests
            cache_key = f"tank_{tank_schema.id}"
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            return Response(tank_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### DELETE ###
class DeleteTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            delete_tank_data = DeleteTankSchema(**request.data)

            # Check if the group exists
            if not Group.objects.filter(pk=delete_tank_data.group_id, user=request.user).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve and delete the tank
            tank = Tank.objects.filter(pk=delete_tank_data.id, group__id=delete_tank_data.group_id, group__user=request.user).first()
            if not tank:
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            tank.delete()

            # Remove cache for this group's tanks
            remove_tanks_cache(delete_tank_data.group_id)

            return Response({}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ###
def remove_tanks_cache(group_id: int):
    """Remove all cached information for tanks in a specific group."""
    cache_key = f"tank_{group_id}"
    cache.delete(cache_key)

def get_tank(tank_id: int, group_id: int, user) -> Tank:
    """Check if the tank exists in the cache and the database."""
    cache_key = f"tank_{tank_id}"

    try:
        # Attempt to retrieve the tank from the cache
        cached_tank = cache.get(cache_key)

        if cached_tank:
            # Return Tank object form cache
            return cached_tank

        # Attempt to retrieve the tank from the database
        tank = Tank.objects.filter(pk=tank_id, group__id=group_id, group__user=user).first()

        if tank:
            # Store Tank object in cache
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

        return tank

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error retrieving tank {tank_id}: {e}")
        return None
    
##############
### SENSOR ###
##############

### GET ###
class GetSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_sensor_data = GetSensorSchema(**request.data)

            # Check the group exists
            if not Group.objects.filter(pk=get_sensor_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_404_NOT_FOUND)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=get_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            # Get sensors in tank (There must be olny one)
            sensors = Sensor.objects.filter(
                tank__id=get_sensor_data.tank_id,
                tank__group__id=get_sensor_data.group_id
            )
            
            # Get sensor 
            sensors_json = [] 
            for sensor in sensors:
                # Serialize the sensor
                sensor_schema = SensorSchema(**model_to_dict(sensor))
                sensors_json.append(sensor_schema.model_dump())

                # Cache the data for future requests
                cache_key = f"sensor_{sensor_schema.id}"
                cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)
                
            if len(sensors_json) > 1:
                return Response({'Bad Request': 'Multiple sensors in this tank'}, status=status.HTTP_400_BAD_REQUEST)
            elif len(sensors_json) == 0:
                return Response({'Bad Request': 'No sensors in this tank'}, status=status.HTTP_404_NOT_FOUND)
            
            return Response(sensors_json[0], status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorsView(APIView):
    def post(self, request):
        try:
            # Get sensors of user
            sensors = Sensor.objects.filter(tank__group__user=request.user)

            # Get sensor 
            sensors_json = [] 
            for sensor in sensors:
                # Serialize the sensor
                sensor_schema = SensorSchema(**model_to_dict(sensor))
                sensors_json.append(sensor_schema.model_dump())

                # Cache the data for future requests
                cache_key = f"sensor_{sensor_schema.id}"
                cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

            return Response(sensors_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            create_sensor_data = CreateSensorSchema(**request.data)
            
            # Check the group exists
            if not Group.objects.filter(pk=create_sensor_data.group_id, user=request.user).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=create_sensor_data.tank_id, user=request.user).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
            # Get tank
            tank = Tank.objects.get(
                pk=create_sensor_data.tank_id,
                group__id=create_sensor_data.group_id,
                group__user=request.user
            )
            
            # Check the tank does not have a sensor already
            if Sensor.objects.filter(tank__id=create_sensor_data.tank_id, user=request.user).exists():
                return Response({'Bad Request': 'Tank already has a sensor'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create a new Sensor object
            sensor = Sensor(
                sensor_id=create_sensor_data.sensor_id,
                is_active=True,
                tank=tank
            )
            sensor.save()

            # Serialize the created sensor
            sensor_schema = SensorSchema(**model_to_dict(sensor))
            sensor_json = sensor_schema.model_dump()

            # Cache the data for future requests
            cache_key = f"sensor_{sensor_schema.id}"
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)
            
            return Response(sensor_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###   
class EditSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            edit_sensor_data = EditSensorSchema(**request.data)

            # Remove cache for this senosr
            remove_sensors_cache(edit_sensor_data.sensor_id)
            
            # Check the group exists
            if not Group.objects.filter(pk=edit_sensor_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=edit_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the sensor exists
            if not Sensor.objects.filter(pk=edit_sensor_data.id).exists():
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the sensor to edit
            sensor = Sensor.objects.get(
                pk=sensor.pk,
                tank_id=edit_sensor_data.tank_id,
                tank__group__id=edit_sensor_data.group_id
            )
            
            # Update sensor fields
            sensor.sensor_id = edit_sensor_data.sensor_id
            sensor.is_active = edit_sensor_data.is_active
            sensor.save()
            
            # Serialize the edited sensor
            sensor_schema = SensorSchema(**model_to_dict(sensor))
            sensor_json = sensor_schema.model_dump()
            
            # Cache the data for future requests
            cache_key = f"sensor_{sensor_schema.id}"
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

            return Response(sensor_json, status=status.HTTP_200_OK)
        except Sensor.DoesNotExist:
            return Response({"error": "Sensor not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### DELETE ### 
class DeleteSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            delete_sensor_data = DeleteSensorSchema(**request.data)
            
            # Remove cache for this senosr
            remove_sensors_cache(delete_sensor_data.sensor_id)

            # Check the group exists
            if not Group.objects.filter(pk=delete_sensor_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=delete_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the sensor exists
            if not Sensor.objects.filter(pk=delete_sensor_data.id).exists():
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                        
            # Get the sensor to delete
            sensor = Sensor.objects.get(
                pk=delete_sensor_data.sensor_id,
                tank__id=delete_sensor_data.tank_id,
                tank__group__user=request.user
            )
            
            # Delete sensor
            sensor.delete()
            
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ### 
def remove_sensors_cache(group_id: int):
    """Remove all cached information for sensors in a specific group."""
    cache_key = f"sensor_{group_id}"
    cache.delete(cache_key)

def get_sensor(sensor_id: int, tank_id: int, group_id: int, user) -> Sensor:
    """Check if the sensor exists in the cache and the database."""
    cache_key = f"sensor_{sensor_id}"

    try:
        # Attempt to retrieve the sensor from the cache
        cached_sensor = cache.get(cache_key)

        if cached_sensor:
            # Return Sensor object form cache
            return cached_sensor

        # Attempt to retrieve the sensor from the database
        sensor = Sensor.objects.filter(pk=sensor_id, tank__id=tank_id, tank__group__id=group_id, tank__group__user=user).first()

        if sensor:
            # Store Sensor object in cache
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

        return sensor

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error retrieving sensor {sensor_id}: {e}")

############
### INFO ###
############

'''
class GetStatsSchema(BaseModel):
    timeframe: int
    period: str

    @validator('period')
    def validate_period(cls, v):
        valid_periods = ['microseconds', 'milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']
        if v not in valid_periods:
            raise ValueError(f"Invalid period. Must be one of: {', '.join(valid_periods)}")
        return v
'''

class GetSummaryView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            # data = GetStatsSchema(**request.data)
            timeframe = 1
            period = "minute"

            summary_schema = SummarySchema(
                level=[],
                status=[],
            )
            
            # Get all groups
            groups = Group.objects.filter(user=request.user)
            
            for group in groups:
                ### STATUS ###
                group_status = GroupStatusSchema(
                    id=group.pk,
                    name=group.name,
                    capacity=0,
                    level=0,
                )
                
                # Get all active tanks and sensors in the group
                tanks = Tank.objects.filter(group=group, group__user=request.user, is_active=True)
                sensors = Sensor.objects.filter(tank__in=tanks, is_active=True)
                
                # Calculate total capacity
                group_status.capacity = tanks.aggregate(total_capacity=Sum('capacity'))['total_capacity'] or 0
                                
                summary_schema.status.append(group_status)

                ### LEVEL ###
                group_level = GroupLevelSchema(
                    id=group.pk,
                    name=group.name,
                    time=[],
                    level=[]
                )

                # Get aggregated sensor readings for the last month
                end_time = timezone.now()
                start_time = end_time - timedelta(days=5)
                readings = SensorReading.timescale.filter(
                    sensor__in=sensors,
                    time__range=(start_time, end_time)
                )
                
                # Bucket readings and calculate average distance
                aggregated_readings = readings.time_bucket(
                    'time',
                    f"{timeframe} {period}"
                ).annotate(
                    avg_distance=Sum('distance') / Count('sensor', distinct=True)
                ).order_by('-bucket')
                
                # Get the most recent bucket
                latest_reading = aggregated_readings.first()
                
                # Add level information to status object
                if latest_reading:
                    group_status.level = latest_reading['avg_distance']

                # Get readings from buckets
                for reading in aggregated_readings:
                    group_level.time.append(int(reading['bucket'].timestamp()))
                    group_level.level.append(reading['avg_distance'])
                
                # Add group infromation to summary
                summary_schema.level.append(group_level)

            # Convert summary to json
            summary_json = summary_schema.model_dump()

            return Response(summary_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### SUMMARY ###
class GetStatsView(APIView):
    def post(self, request):
        try:
            groups = Group.objects.filter(user=request.user)
            
            summary_json = {
                "inflow": [random.randrange(0, 100) for g in range(10)],
                "outflow": [random.randrange(0, 100) for g in range(10)],
                "savings": [random.randrange(0, 100) for g in range(10)]
            }

            return Response(summary_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)