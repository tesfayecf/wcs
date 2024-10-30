from django.core.cache import cache
from django.db.models import Count, Sum, Q, Avg

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Tank, Group, Sensor
from .serializers import *

# Cache timeout in seconds (e.g., 5 minutes)
CACHE_TIMEOUT = 300 

"""
TODO
- Define error handlers / return codes
- Add unit tests
- Add documentation
"""

#############
### GROUP ###
#############

class CreateGroupView(APIView):
    """
    View for creating a new group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for creating a new group.
    """

    def post(self, request):
        """
        Handles POST requests for creating a new group.

        Parameters:
        - request: The HTTP request object containing group data.

        Returns:
        - Response: HTTP response with the created group data if successful,
                    or an error message if the group already exists or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = CreateGroupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. Retrieve necessary objects
            group_queryset = Group.objects.filter(name=serializer.validated_data['name'], user=request.user)
            if group_queryset:
                return Response({'Bad Request': 'Group with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. Check for conflicts
            # 4. Perform main operation
            group = Group.objects.create(
                name=serializer.validated_data['name'],
                location=serializer.validated_data['location'], 
                description=serializer.validated_data['description'],
                user=request.user
            )
            
            # 5. Store respnse data in cache
            cache_key = f"group_{group.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            # 6. Prepare and return response
            serializer = GroupSerializer(data=group)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetGroupView(APIView):
    """
    View for retrieving a specific group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving a group by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving a group.

        Parameters:
        - request: The HTTP request object containing the group ID.

        Returns:
        - Response: HTTP response with the group data if found,
                    or an error message if the group does not exist or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetGroupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. Retrieve necessary objects
            group = get_group(serializer.validated_data['id'], request.user)
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. Check for conflicts
            # 4. Perform main operation
            # 5. Store respnse data in cache
            # 6. Prepare and return response
            serializer = GroupSerializer(group)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetGroupsView(APIView):
    """
    View for retrieving all groups associated with the authenticated user.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving all groups.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving all groups.

        Parameters:
        - request: The HTTP request object.

        Returns:
        - Response: HTTP response with a list of groups associated with the user,
                    or an error message if an exception occurs.
        """
        try:
            # TODO: check for groups in cache
            # 1. Validate input data
            # 2. Retrieve necessary objects
            groups = Group.objects.filter(user=request.user)
            for group in groups:
                cache_key = f"group_{group.id}"
                cache.set(cache_key, group, timeout=CACHE_TIMEOUT)

            # 3. Check for conflicts
            # 4. Perform main operation
            # 5. Store respnse data in cache
            # 6. Prepare and return response
            serializer = GroupSerializer(groups, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateGroupView(APIView):
    """
    View for updating an existing group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for updating a group.
    """

    def post(self, request):
        """
        Handles POST requests for updating a group.

        Parameters:
        - request: The HTTP request object containing the group data to be updated.

        Returns:
        - Response: HTTP response with the updated group data if successful,
                    or an error message if the group does not exist or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = UpdateGroupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. Retrieve necessary objects
            group = get_group(serializer.validated_data['id'], request.user)
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
            clear_group_cache(serializer.validated_data['id'])
            
            # 3. Check for conflicts
            if Group.objects.filter(
                name=serializer.validated_data['name'], 
                user=request.user
            ).exclude(pk=serializer.validated_data['id']).exists():
                return Response({'Bad Request': 'Group with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # 4. Perform main operation
            for attr, value in serializer.validated_data.items():
                setattr(group, attr, value)
            group.save()

            # 5. Store respnse data in cache
            cache_key = f"group_{group.id}"
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
            
            # 6. Prepare and return response
            serializer = GroupSerializer(group)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteGroupView(APIView):
    """
    View for deleting a group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for deleting a group.
    """

    def post(self, request):
        """
        Handles POST requests for deleting a group.

        Parameters:
        - request: The HTTP request object containing the group ID to be deleted.

        Returns:
        - Response: HTTP response indicating the result of the deletion.
        """
        try:
            # 1. Validate input data
            serializer = DeleteGroupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. Retrieve necessary objects
            group = get_group(serializer.validated_data['id'], request.user)
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
            clear_group_cache(serializer.validated_data['id'])
            
            # 3. Check for conflicts
            # 4. Perform main operation
            group.delete()

            # 5. Store respnse data in cache
            # 6. Prepare and return response
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### INFO ###
class GetGroupInfoView(APIView):
    """
    View for retrieving information about a specific group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving group information.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving group information.

        Parameters:
        - request: The HTTP request object containing the group ID.

        Returns:
        - Response: HTTP response with the group information if successful,
                    or an error message if the group does not exist or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetGroupInfoSerializer.Get(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects
            group_info = get_group_info(serializer.validated_data['id'], request.user)
            if group_info:
                return Response(group_info, status=status.HTTP_200_OK)

            # 3. Check for conflicts
            # 4. Perform main operation
            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).annotate(
                total_tanks=Count('tanks'),
                total_active_tanks=Count('tanks', filter=Q(tanks__is_active=True)),
                max_capacity=Sum('tanks__capacity'),
                current_capacity=Sum('tanks__capacity', filter=Q(tanks__is_active=True)),
                total_sensors=Count('tanks__sensor'),
                total_active_sensors=Count('tanks__sensor', filter=Q(tanks__sensor__is_active=True)),
                total_inactive_sensors=Count('tanks__sensor', filter=Q(tanks__sensor__is_active=False)),
                average_capacity=Avg('tanks__capacity'),
            ).first()

            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            info = {
                'total_tanks': group.total_tanks,
                'total_active_tanks': group.total_active_tanks,
                'total_sensors': group.total_sensors,
                'total_active_sensors': group.total_active_sensors,
                'total_inactive_sensors': group.total_inactive_sensors,
                'max_capacity': group.max_capacity or 0,
                'current_capacity': group.current_capacity or 0,
                'average_capacity': group.average_capacity or 0,
            }

            # 5. Store respnse data in cache
            cache_key = f"group_info_{group.id}"
            cache.set(cache_key, info, timeout=CACHE_TIMEOUT)

            # 6. Prepare and return response
            serializer = GroupInfoSerializer(info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### METRICS ###
class GetGroupMetricsView(APIView):
    """
    View for retrieving statistics about a specific group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving group statistics.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving group statistics.

        Parameters:
        - request: The HTTP request object containing the group ID.

        Returns:
        - Response: HTTP response with the group statistics if successful,
                    or an error message if the group does not exist or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetGroupMetricsSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects
            group_stats = get_group_stats(serializer.validated_data['id'], request.user)
            if group_stats:
                return Response(group_stats, status=status.HTTP_200_OK)

            group = Group.objects.filter(pk=serializer.validated_data['id'], user=request.user).annotate(
                # TODO: Add more stats here
            ).first()
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            # 3. Check for conflicts
            # 4. Perform main operation
            # Implement get_stats() method on Group model or compute stats here
            stats = {}

            cache_key = f"group_stats_{serializer.validated_data['id']}"
            cache.set(cache_key, stats, timeout=CACHE_TIMEOUT)

            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ###
# TODO: add user info to cache to know if user has access to group
def get_group(group_id: int, user) -> Group:
    """Check if the group exists in the cache and the database."""
    cache_key = f"group_{group_id}"

    try:
        group = cache.get(cache_key)
        if group:
            return group  

        group = Group.objects.filter(pk=group_id, user=user).prefetch_related('tanks', 'sensors').first()
        if group:
            cache.set(cache_key, group, timeout=CACHE_TIMEOUT)
    
        return group
    
    except Exception as e:
        raise Exception(f"Failed to retrieve group with ID {group_id}") from e
    
def get_group_info(group_id: int, user):
    """Retrieve group information from the cache if it exists, otherwise return None."""
    cache_key = f"group_info_{group_id}"

    cached_group = cache.get(cache_key)
    if cached_group:
        return cached_group

    return None

def get_group_stats(group_id: int, user):
    """Retrieve group stats from the cache if it exists, otherwise return None."""
    cache_key = f"group_stats_{group_id}"

    cached_group = cache.get(cache_key)
    if cached_group:
        return cached_group

    return None

def get_group_metrics(group_id: int, user):
    """Retrieve group metrics from the cache if it exists, otherwise return None."""
    cache_key = f"group_metrics_{group_id}"

    cached_group = cache.get(cache_key)
    if cached_group:
        return cached_group

    return None

def clear_group_cache(group_id: int):
    """Remove all cached information for a specific group."""
    cache_key_patterns = [
        f"group_{group_id}",
        f"group_info_{group_id}",
        f"group_stats_{group_id}",
    ]

    for key in cache_key_patterns:
        cache.delete(key)

############
### TANK ###
############

class CreateTankView(APIView):
    """
    View for creating a new tank.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for creating a new tank.
    """

    def post(self, request):
        """
        Handles POST requests for creating a new tank.

        Parameters:
        - request: The HTTP request object containing tank data.

        Returns:
        - Response: HTTP response with the created tank data if successful,
                    or an error message if the tank already exists or an exception occurs.
        """
        try:
            serializer = CreateTankSerializer(request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            group = get_group(serializer.validated_data['group'], request.user)
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_400_BAD_REQUEST)

            if Tank.objects.filter(
                name=serializer.validated_data['name'], 
                group__id=serializer.validated_data['group'], 
                group__user=request.user
            ).exists():
                return Response({'Bad Request': 'Tank with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create and save a new Tank object
            tank = Tank(
                name=serializer.validated_data['name'],
                description=serializer.validated_data['description'],
                type=serializer.validated_data['type'],
                capacity=serializer.validated_data['capacity'],
                is_active=True,
                group=group,
            )
            tank.save()

            cache_key = f"tank_{tank.id}"
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            serializer = TankSerializer(tank)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTankView(APIView):
    """
    View for retrieving a specific tank.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving a tank by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving a tank.

        Parameters:
        - request: The HTTP request object containing the tank ID and group ID.

        Returns:
        - Response: HTTP response with the tank data if found,
                    or an error message if the tank does not exist or an exception occurs.
        """
        try:
            serializer = GetTankSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            tank = Tank.objects.filter(pk=serializer.validated_data['id']).first()
            if not tank:
                return Response({'Bad Request': 'Tank not foundt'}, status=status.HTTP_400_BAD_REQUEST)

            cache_key = f"tank_{tank.id}"
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            tank_serializer = TankSerializer(tank)
            return Response(tank_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTanksView(APIView):
    """
    View for retrieving all tanks associated with a specific group.

    Inherits from: rest_framework.views.APIView

    Methods:
    - get: Handles GET requests for retrieving all tanks in a group.
    """

    def post(self, request):
        """
        Handles GET requests for retrieving all tanks.

        Parameters:
        - request: The HTTP request object containing the group ID.

        Returns:
        - Response: HTTP response with the list of tanks if found,
                    or an error message if the group does not exist or an exception occurs.
        """
        try:
            serializer = GetTanksSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            group = get_group(serializer.validated_data['group'], request.user)
            if not group:
                return Response({'Bad Request': 'Group not found'}, status=status.HTTP_400_BAD_REQUEST)

            tanks = Tank.objects.filter(group=group)
            for tank in tanks:
                cache_key = f"tank_{tank.id}"
                cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            serializer = TankSerializer(tanks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateTankView(APIView):
    """
    View for updating an existing tank.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for updating a tank by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for updating a tank.

        Parameters:
        - request: The HTTP request object containing the tank data.

        Returns:
        - Response: HTTP response with the updated tank data if successful,
                    or an error message if the tank does not exist or an exception occurs.
        """
        try:
            serializer = UpdateTankSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            tank = get_tank(serializer.validated_data['id'], request.user)
            if not tank:
                return Response({'Bad Request': 'Tank not found'}, status=status.HTTP_400_BAD_REQUEST)
            clear_tanks_cache(tank.id)

            if Tank.objects.filter(
                name=serializer.validated_data['name'], 
                group__id=serializer.validated_data['group'], 
                group__user=request.user
            ).exclude(pk=serializer.validated_data['id']).exists():
                return Response({'Bad Request': 'Tank with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            for attr, value in serializer.validated_data.items():
                setattr(tank, attr, value)
            tank.save()

            cache_key = f"tank_{tank.id}"
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

            serializer = TankSerializer(tank).data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteTankView(APIView):
    """
    View for deleting an existing tank.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for deleting a tank by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for deleting a tank.

        Parameters:
        - request: The HTTP request object containing the tank ID.

        Returns:
        - Response: HTTP response with an empty body if successful,
                    or an error message if the tank does not exist or an exception occurs.
        """
        try:
            serializer = DeleteTankSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            tank = get_tank(serializer.validated_data['id'], request.user)
            if not tank:
                return Response({'Bad Request': 'Tank not found'}, status=status.HTTP_400_BAD_REQUEST)
            clear_tanks_cache(tank.id)

            tank.delete()

            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### INFO ###
class GetTankInfoView(APIView):
    """
    View for retrieving tank information.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving tank information.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving tank information.

        Parameters:
        - request: The HTTP request object containing the tank ID.

        Returns:
        - Response: HTTP response with the tank information if successful,
        """
        try:
            # serializer = GetTankInfoSerializer(data=request.data)
            # if not serializer.is_valid():
            #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # tank = get_tank(serializer.validated_data['id'], request.user)
            # if not tank:
            #     return Response({'Bad Request': 'Tank not found'}, status=status.HTTP_400_BAD_REQUEST)

            # serializer = TankInfoSerializer(tank).data
            # return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ###
def get_tank(tank_id: int, int, user) -> Tank:
    """Check if the tank exists in the cache and the database."""
    cache_key = f"tank_{tank_id}"

    try:
        cached_tank = cache.get(cache_key)

        if cached_tank:
            return cached_tank

        tank = Tank.objects.filter(pk=tank_id, group__user=user).first()

        if tank:
            cache.set(cache_key, tank, timeout=CACHE_TIMEOUT)

        return tank

    except Exception as e:
        raise Exception(f"Failed to retrieve tank with ID {tank_id}") from e

def clear_tanks_cache(tank_id: int):
    """Remove all cached information for tanks in a specific group."""
    cache_key = f"tank_{tank_id}"
    cache.delete(cache_key)

##############
### SENSOR ###
##############

class CreateSensorView(APIView):
    """
    View for creating a new sensor.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for creating a new sensor.
    """

    def post(self, request):
        """
        Handles POST requests for creating a new sensor.

        Parameters:
        - request: The HTTP request object containing sensor data.

        Returns:
        - Response: HTTP response with the created sensor data if successful,
                    or an error message if validation fails or an exception occurs.
        """
        try:
            serializer = CreateSensorSerializer(request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            tank = get_tank(serializer.validated_data['tank'], request.user)
            if not tank:
                return Response({'Bad Request': 'Tank not found'}, status=status.HTTP_400_BAD_REQUEST)
        
            if Sensor.objects.filter(name=serializer.validated_data['name'], tank=tank).exists():
                return Response({'Bad Request': 'Sensor with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new Sensor object
            sensor = Sensor(
                name=serializer.validated_data['name'],
                description=serializer.validated_data['description'],
                notes=serializer.validated_data['notes'],
                device_id=serializer.validated_data['device_id'],
                type=serializer.validated_data['type'],
                status=serializer.validated_data['status'],
                installation_date=serializer.validated_data['installation_date'],
                maintenance_date=serializer.validated_data['maintenance_date'],
                is_active=serializer.validated_data['is_active'],
                tank=tank
            )
            sensor.save()

            # Cache the data for future requests
            cache_key = f"sensor_{sensor.id}"
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)
            
            serializer = SensorSerializer(sensor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Updated status code
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorView(APIView):
    """
    View for retrieving a specific sensor.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving a sensor by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving a sensor.

        Parameters:
        - request: The HTTP request object containing the sensor ID.

        Returns:
        - Response: HTTP response with the sensor data if successful,
                    or an error message if the sensor does not exist or an exception occurs.
        """
        try:
            serializer = GetSensorSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            sensor = get_sensor(serializer.validated_data['id'], request.user)
            if not sensor:
                return Response({'Bad Request': 'Sensor not found'}, status=status.HTTP_400_BAD_REQUEST)

            # Cache the data for future requests
            cache_key = f"sensor_{sensor.id}"
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

            serializer = SensorSerializer(sensor)            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorsView(APIView):
    """
    View for retrieving all sensors associated with a specific tank.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving sensors by tank ID.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving sensors.

        Parameters:
        - request: The HTTP request object containing the tank ID.

        Returns:
        - Response: HTTP response with a list of sensors if successful,
                    or an error message if the tank does not exist or an exception occurs.
        """
        try:
            serializer = GetSensorsSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            tank = get_tank(serializer.validated_data['tank'], request.user)
            if not tank:
                return Response({'Bad Request': 'Tank not found'}, status=status.HTTP_400_BAD_REQUEST)

            sensors = Sensor.objects.filter(tank=tank)
            for sensor in sensors:
                cache_key = f"sensor_{sensor.id}"
                cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

            serializer = SensorSerializer(sensors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateSensorView(APIView):
    """
    View for updating an existing sensor.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for updating a sensor by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for updating a sensor.

        Parameters:
        - request: The HTTP request object containing the sensor data.

        Returns:
        - Response: HTTP response with the updated sensor data if successful,
                    or an error message if the sensor does not exist or an exception occurs.
        """
        try:
            serializer = UpdateSensorSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            sensor = get_sensor(serializer.validated_data['id'], request.user)
            if not sensor:
                return Response({'Bad Request': 'Sensor not found'}, status=status.HTTP_400_BAD_REQUEST)
            clear_sensors_cache(sensor.id)

            if Sensor.objects.filter(
                name=serializer.validated_data['name'],
                sensor__id=serializer.validated_data['id']
            ).exclude(pk=serializer.validated_data['id']).exists():
                return Response({'Bad Request': 'Sensor with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            for attr, value in serializer.validated_data.items():
                setattr(sensor, attr, value)
            sensor.save()
            
            cache_key = f"sensor_{sensor.id}"
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

            serializer = SensorSerializer(sensor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Sensor.DoesNotExist:
            return Response({"error": "Sensor not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteSensorView(APIView):
    """
    View for deleting an existing sensor.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for deleting a sensor by its ID.
    """

    def post(self, request):
        """
        Handles POST requests for deleting a sensor.

        Parameters:
        - request: The HTTP request object containing the sensor ID.

        Returns:
        - Response: HTTP response with an empty body if successful,
                    or an error message if the sensor does not exist or an exception occurs.
        """
        try:
            serializer = DeleteSensorSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            sensor = get_sensor(serializer.validated_data['id'], request.user)
            if not sensor:
                return Response({'Bad Request': 'Sensor not found'}, status=status.HTTP_400_BAD_REQUEST)
            clear_sensors_cache(sensor.id)

            sensor.delete()
            
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CACHE ### 
def get_sensor(sensor_id: int, user):
    """Check if the sensor exists in the cache and the database."""
    cache_key = f"sensor_{sensor_id}"

    try:
        sensor = cache.get(cache_key)
        if sensor:
            return sensor

        sensor = Sensor.objects.filter(pk=sensor_id, tank__group__user=user).prefetch_related('tanks').first()
        if sensor:
            cache.set(cache_key, sensor, timeout=CACHE_TIMEOUT)

        return sensor
    
    except Exception as e:
        raise Exception(f"Failed to retrieve sensor with ID {sensor_id}") from e

def clear_sensors_cache(sensor_id: int):
    """Remove all cached information for a specific sensor."""
    cache_key = f"sensor_{sensor_id}"
    cache.delete(cache_key)