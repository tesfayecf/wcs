from .models import Tank, Group, Sensor
from .schemas import *

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

def to_dict(model):
    model_dict = {}
    for field in model._meta.fields:
        model_dict[field.name] = getattr(model, field.name)
    return model_dict

#############
### GROUP ###
#############

### GET ###
class GetGroupsView(APIView):
    def post(self, request):
        try:
            user = request.user
            groups = Group.objects.filter(user=user)

            groups_json = []
            for group in groups:
                group_schema = GroupSchema(**to_dict(group))
                groups_json.append(group_schema.model_dump_json())

            return Response(groups_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
### CREATE ###
class CreateGroupView(APIView):
    def post(self, request):
        try:
            create_group_data = CreateGroupSchema(**request.data)
                       
            # Check if a group with the same name already exists
            if Group.objects.filter(name=create_group_data.name, user=request.user).exists():
                return Response({'Bad Request': 'Group with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create a new Group object
            group = Group(
                name=create_group_data.name,
                location=create_group_data.location,
                description=create_group_data.description,
                user=request.user
            )
            group.save()
            
            # Get created group
            group_schema = GroupSchema(**to_dict(group))
            
            # Convert to JSON
            group_json = group_schema.model_dump_json()
            
            return Response(group_json, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###
class EditGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            edit_group_data = EditGroupSchema(**request.data)
            
            # Check the group exists
            if not Group.objects.filter(pk=edit_group_data.id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the group to edit
            group = Group.objects.get(
                pk=edit_group_data.id, 
                user=request.user
            )
            
            # Update group fields
            group.name = edit_group_data.name
            group.location = edit_group_data.location
            group.description = edit_group_data.description
            group.save()
            
            # Get created group
            group_schema = GroupSchema(**to_dict(group))
            
            # Convert to JSON
            group_json = group_schema.model_dump_json()
            
            return Response(group_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
### DELETE ###         
class DeleteGroupView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            delete_group_data = DeleteGroupSchema(**request.data)

            # Check the group exists
            if not Group.objects.filter(pk=delete_group_data.id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the group to delete
            group = Group.objects.get(
                pk=delete_group_data.id,
                user=request.user
            )
            
            # Delete group
            group.delete()
            
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### STATS ###
class GetGroupStatsView(APIView):
    def post(self, request):
        # tank_group = getGroup(request=request)
        # data = {
        #     'total_tanks': tank_group.total_tanks(),
        #     'average_water_level': tank_group.total_active_tanks(),
        #     'total_sensor_data': tank_group.total_sensor_data(),
        #     'average_water_level': tank_group.average_water_level(),
        #     'min_water_level': tank_group.min_water_level,
        #     'max_water_level': tank_group.max_water_level,
        #     'average_temperature': tank_group.average_temperature,
        # }
        return Response({}, status=status.HTTP_200_OK)


############
### TANK ###
############

### GET ###
class GetTanksView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            get_group_data = GetTanksSchema(**request.data)
            # Validate the deserialized data
            get_group_data.model_validate()

            # Check the group exists
            if not Group.objects.filter(pk=get_group_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            tanks = Tank.objects.filter(
                group__id=get_group_data.group_id,
                group__user=request.user
            )
            
            tank_schema = TankSchema(many=True)
            serialized_tanks = tank_schema.dump(tanks)
            
            # Convert to JSON
            tanks_json = dict(serialized_tanks)
            
            return Response(tanks_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateTankView(APIView):
    def post(self, request):
            try:
                # Deserialize request data using Pydantic schema
                create_tank_data = CreateTankSchema(**request.data)
                # Validate the deserialized data
                create_tank_data.model_validate()
                
                # Check the group exists
                if not Group.objects.filter(pk=create_tank_data.group_id, user=request.user).exists():
                    return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                # Get the group
                group = Group.objects.get(pk=create_tank_data.group_id, user=request.user)

                # Check if a tank with the same name already exists
                if Tank.objects.filter(name=create_tank_data.name, group__id=create_tank_data.group_id, group__user=request.user).exists():
                    return Response({'Bad Request': 'Tank with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)

                # Create a new Tank object
                tank = Tank(
                    name=create_tank_data.name,
                    tank_type=create_tank_data.type,
                    capacity=create_tank_data.capacity,
                    is_active=True,
                    group=group,
                    user=request.user
                )
                tank.save()         
                
                tank_schema = TankSchema()
                serialized_tank = tank_schema.dump(tank)
                
                # Convert to JSON
                tank_json = dict(serialized_tank)
                
                return Response(tank_json, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
### EDIT ###          
class EditTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            edit_tank_data = EditTankSchema(**request.data)
            # Validate the deserialized data
            edit_tank_data.model_validate()
            
            # Check the group exists
            if not Group.objects.filter(pk=edit_tank_data.group_id, user=request.user).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check the tank exists
            if not Tank.objects.filter(pk=edit_tank_data.id, group__id=edit_tank_data.group_id, group__user=request.user).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the tank to edit
            tank = Tank.objects.get(
                pk=edit_tank_data.id, 
                group__id=edit_tank_data.group_id, 
                group__user=request.user
            )
            
            # Update tank fields
            tank.name = edit_tank_data.name
            tank.type = edit_tank_data.type
            tank.capacity = edit_tank_data.capacity
            tank.save()
            
            tank_schema = TankSchema()
            serialized_tank = tank_schema.dump(tank)
            
            # Convert to JSON
            tank_json = dict(serialized_tank)
            
            return Response(tank_json, status=status.HTTP_200_OK)
        except Tank.DoesNotExist:
            return Response({"error": "Tank not found."}, status=status.HTTP_404_NOT_FOUND)

### DELETE ### 
class DeleteTankView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            delete_tank_data = DeleteTankSchema(**request.data)
            # Validate the deserialized data
            delete_tank_data.model_validate()
            
            # Check the group exists
            if not Group.objects.filter(pk=delete_tank_data.group_id, user=request.user).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check the tank exists
            if not Tank.objects.filter(pk=delete_tank_data.id, group__id=delete_tank_data.group_id, group__user=request.user).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the tank to delete
            tank = Tank.objects.get(
                pk=delete_tank_data.id, 
                group__id=delete_tank_data.group_id, 
                group__user=request.user
            )
            
            # Deleta tank
            tank.delete()
            
            return Response({"message": "Group deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


##############
### SENSOR ###
##############

### GET ###
class GetSensorsView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            get_sensor_data = GetSensorSchema(**request.data)
            # Validate the deserialized data
            get_sensor_data.model_validate()

            # Check the group exists
            if not Group.objects.filter(pk=get_sensor_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=get_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            sensor = Sensor.objects.filter(
                tank__id=get_sensor_data.tank_id,
                tank__group__id=get_sensor_data.group_id
            )
            
            sensor_schema = SensorSchema()
            serialized_sensors = sensor_schema.dump(sensor)
            
            # Convert to JSON
            sensor_json = dict(serialized_sensors)
            
            return Response(sensor_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            create_sensor_data = CreateSensorSchema(**request.data)
            # Validate the deserialized data
            create_sensor_data.model_validate()
            
            # Check the group exists
            if not Group.objects.filter(pk=create_sensor_data.group_id).exists():
                return Response({'Bad Request': 'Group does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Check if the tank exists
            if not Tank.objects.filter(pk=create_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the tank does not have a sensor already
            if Sensor.objects.filter(tank__id=create_sensor_data.tank_id).exists():
                return Response({'Bad Request': 'Tank already has a sensor'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create a new Sensor object
            sensor = Sensor(
                token=create_sensor_data.token,
                is_active=True,
                tank_id=create_sensor_data.tank_id
            )
            sensor.save()

            sensor_schema = SensorSchema()
            serialized_sensor = sensor_schema.dump(sensor)
            
            # Convert to JSON
            sensor_json = dict(serialized_sensor)
            
            return Response(sensor_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###   
class EditSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            edit_sensor_data = EditSensorSchema(**request.data)
            # Validate the deserialized data
            edit_sensor_data.model_validate()
            
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
            sensor.token = edit_sensor_data.token
            sensor.is_active = edit_sensor_data.is_active
            sensor.save()
            
            sensor_schema = SensorSchema()
            serialized_sensor = sensor_schema.dump(sensor)
            
            # Convert to JSON
            sensor_json = dict(serialized_sensor)
            
            return Response(sensor_json, status=status.HTTP_200_OK)
        except Sensor.DoesNotExist:
            return Response({"error": "Sensor not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### DELETE ### 
class DeleteSensorView(APIView):
    def post(self, request):
        try:
            # Deserialize request data using Pydantic schema
            delete_sensor_data = DeleteSensorSchema(**request.data)
            # Validate the deserialized data
            delete_sensor_data.model_validate()
            
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
                pk=delete_sensor_data.id,
                tank__id=delete_sensor_data.tank_id,
                tank__group__user=request.user
            )
            
            # Delete sensor
            sensor.delete()
            
            return Response({"message": "Sensor deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
