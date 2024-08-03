import random
from pydantic import ValidationError

from django.core.cache import cache

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .schemas import *
from .models import Tank, Group, Sensor
from utils.misc import model_to_dict

# Cache timeout in seconds (e.g., 5 minutes)
CACHE_TIMEOUT = 300

###############
### SUMMARY ###
###############

### GET ###
class GetSummaryView(APIView):
    def post(self, request):
        try:
            groups = Group.objects.filter(user=request.user)
            
            summary_json = {
                "level": [random.randrange(0, 100) for g in groups],
                "inflow": [random.randrange(0, 100) for g in range(10)],
                "outflow": [random.randrange(0, 100) for g in range(10)],
                "savings": [random.randrange(0, 100) for g in range(10)]
            }

            return Response(summary_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#############
### GROUP ###
#############

### GET ###
class GetGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_group_data = GetGroupSchema(**request.data)
            
            # Cache key based on group ID and user ID
            cache_key = f"group_{get_group_data.id}"
            cached_group = cache.get(cache_key)

            if cached_group:
                group = cached_group
            else:
                # Retrieve the group
                group = Group.objects.filter(pk=get_group_data.id, user=request.user).first()
                if not group:
                    return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Cache the information for future requests
                cache.set(cache_key, group, timeout=CACHE_TIMEOUT)

            # Serialize the group
            group_schema = GroupSchema(**model_to_dict(group))
            group_json = group_schema.model_dump()

            return Response(group_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetGroupsView(APIView):
    def post(self, request):
        try:
            # If not in cache, retrieve from database
            groups = Group.objects.filter(user=request.user)
            
            # Serialize groups
            groups_json = [GroupSchema(**model_to_dict(group)).model_dump() for group in groups]

            return Response(groups_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            create_group_data = CreateGroupSchema(**request.data)
            
            # Check if a group with the same name already exists
            if Group.objects.filter(name=create_group_data.name, user=request.user).exists():
                return Response({'Bad Request': 'Group with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create and save a new Group object
            group = Group(
                name=create_group_data.name,
                location=create_group_data.location,
                description=create_group_data.description,
                user=request.user
            )
            group.save()
            
            # Serialize the created group
            group_schema = GroupSchema(**model_to_dict(group))
            group_json = group_schema.model_dump()

            # Cache the data for future requests
            cache_key = f"group_{group_schema.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            return Response(group_json, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###
class EditGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            edit_group_data = EditGroupSchema(**request.data)
            
            # Remove cache for this group
            remove_group_cache(edit_group_data.id)

            # Retrieve the group
            group = Group.objects.filter(pk=edit_group_data.id, user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update group fields
            group.name = edit_group_data.name
            group.location = edit_group_data.location
            group.description = edit_group_data.description
            group.save()

            # Cache the information for future requests
            cache_key = f"group_data_{group_schema.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            # Serialize the edited group
            group_schema = GroupSchema(**model_to_dict(group))
            group_json = group_schema.model_dump()
            
            return Response(group_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
### DELETE ###         
class DeleteGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            delete_group_data = DeleteGroupSchema(**request.data)

            # Retrieve and delete the group
            group = Group.objects.filter(pk=delete_group_data.id, user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete the group
            group.delete()

            # Remove cache for this group
            remove_group_cache(delete_group_data.id)
            
            return Response({}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### INFO ###
class GetGroupInfoView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_group_data = GetGroupSchema(**request.data)

            # Cache key based on group ID and user ID
            cache_key = f"group_info_{get_group_data.id}"
            cached_info = cache.get(cache_key)

            if cached_info:
                return Response(cached_info, status=status.HTTP_200_OK)

            # Retrieve the group
            group = Group.objects.filter(pk=get_group_data.id, user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            info = {
                'total_tanks': group.total_tanks(),
                'total_active_tanks': group.total_active_tanks(),
                'total_capacity': group.total_capacity(),
                'total_active_capacity': group.total_active_capacity(),
                'total_sensors': group.total_sensors(),
                'total_active_sensors': group.total_active_sensors(),
            }

            # Cache the information for future requests
            cache.set(cache_key, info, timeout=CACHE_TIMEOUT)

            return Response(info, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### STATS ###
class GetGroupStatsView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            get_group_data = GetGroupSchema(**request.data)

            # Cache key based on group ID and user ID
            cache_key = f"group_stats_{get_group_data.id}_{request.user.id}"
            cached_stats = cache.get(cache_key)

            if cached_stats:
                return Response(cached_stats, status=status.HTTP_200_OK)

            # Retrieve the group
            group = Group.objects.filter(pk=get_group_data.id, user=request.user).first()
            if not group:
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get group statistics
            # stats = group.get_stats()
            stats = {}

            # Cache the statistics for future requests
            cache.set(cache_key, stats, timeout=CACHE_TIMEOUT)

            return Response(stats, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
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
        # Attempt to retrieve the group from the cache
        cached_group = cache.get(cache_key)

        if cached_group:
            # Return Group object form cache
            return cached_group  

        # Attempt to retrieve the group from the database
        group = Group.objects.filter(pk=group_id, user=user).first()

        if group:
            # Store Group object in cache
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)

        return group

    except Exception as e:
        # Log the exception for debugging purposes
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
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=get_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
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
                return Response({'Bad Request': 'More than one sensor in this tank'}, status=status.HTTP_400_BAD_REQUEST)
            elif len(sensors_json) == 0:
                return Response({'Bad Request': 'No sensors in this tank'}, status=status.HTTP_400_BAD_REQUEST)
            
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