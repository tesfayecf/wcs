from .models import SensorReading
from data.models import Group, Tank, Sensor
from django.db.models import Q, F, Window, Sum, FloatField, Case, When, Min, Max, Avg, StdDev
from django.db.models.functions import Lag
from .schemas import *

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

def to_dict(model):
    model_dict = {}
    for field in model._meta.fields:
        model_dict[field.name] = getattr(model, field.name)
    return model_dict

def distance_to_height(distance, tank_height):
    """
    Converts sensor reading distance to water height in the tank.
    """
    if distance is None:
        return None  # Handle missing distance values
    return tank_height - distance

#####################
### SENOR READING ###
#####################

class GetSensorReadingsView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            # data = GetSensorReadingsSchema(**request.data)
            data = GetSensorReadingsSchema(
                id=1,
                start_time='2024-02-01T00:00:00',
                end_time='2024-05-02T00:00:00',
                timeframe='5',
                period='minutes'
            )
            
            # Check sensor exists
            sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                       
            # Get sensor readings
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(data.start_time, data.end_time)
            )
            
            # Bucket readings
            readings = readings.time_bucket(
                'time', 
                f"{str(data.timeframe)} {data.period}"
            )
            
            # Get distance values
            readings = readings.annotate(
                distance=F('distance')
            )
                        
            # Serialize sensor readings
            readings_json = []
            for reading in readings:
                reading_json = SensorReadingSchema(
                    time=reading['bucket'],
                    distance=reading['distance'],
                )
                readings_json.append(reading_json.model_dump())
            
            return Response(readings_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetLastSensorReadingView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetLastSensorReadingSchema(**request.data)

            # Check sensor exists
            sensor = Sensor.time.filter(pk=data.id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get last sensor reading
            last_reading = SensorReading.timescale.last(sensor=sensor)
            
            # Serialize last sensor reading
            serializer = SensorReadingSchema(**to_dict(last_reading))
            return Response(serializer.data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetNetFlowView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            # data = GetSensorReadingsSchema(**request.data)
            data = GetSensorReadingsSchema(
                id=1,
                start_time='2024-02-01T00:00:00',
                end_time='2024-05-02T00:00:00',
                timeframe='5',
                period='minutes'
            )

            sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(data.start_time, data.end_time)
            )

            readings = readings.time_bucket_ng(
                'time',
                f"{str(data.timeframe)} {data.period}",
                start='2024-02-01T00:00:00',
                end='2024-05-02T00:00:00',
            )

            readings = readings.annotate(
                distance=F('distance')
            )

            c_inflow, c_outflow = 0, 0
            in_out_flow_data = []
            for index, reading in enumerate(readings):
                if index == 0: inflow, outflow = 0, 0
                else: 
                    inflow = max(0, readings[index]['distance'] - readings[index - 1]['distance'])
                    outflow = min(0, readings[index]['distance'] - readings[index - 1]['distance'])
                c_inflow += inflow
                c_outflow += -1*outflow
                in_out_flow_data.append({
                    'time': reading['bucket'],
                    'distance': reading['distance'],
                    'inflow': c_inflow,
                    'outflow': c_outflow,
                })

            return Response(in_out_flow_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetNetFlowView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             # data = GetSensorReadingsSchema(**request.data)
#             data = GetSensorReadingsSchema(
#                 id=1,
#                 start_time='2024-02-01T00:00:00',
#                 end_time='2024-05-02T00:00:00',
#                 timeframe='5',
#                 period='minutes'
#             )
            
#             # Check sensor exists
#             sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Apply window function for cumulative net flow
#             readings = readings.annotate(
#                 distance=F('distance'),
#                 previous_distance=Lag('distance', order_by='time'),
#                 inflow=Case(
#                     When(previous_distance__isnull=True, then=F('distance')),
#                     default=F('distance') - Lag('distance', order_by='time')
#                 ),
#                 outflow=Case(
#                     When(previous_distance__isnull=True, then=0),
#                     default=F('distance') - Lag('distance', order_by='time')
#                 ) * -1,
#                 cumulative_inflow=Window(
#                     expression=Sum('inflow'),
#                     order_by=F('time')
#                 ),
#                 cumulative_outflow=Window(
#                     expression=Sum('outflow'),
#                     order_by=F('time')
#                 )
#             )

#             # Serialize and return response data
#             data = [
#                 {
#                     'time': reading['time'],
#                     'distance': reading['distance'],
#                     'inflow': reading['cumulative_inflow'],
#                     'outflow': reading['cumulative_outflow'],
#                 }
#                 for reading in readings
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorStatisticsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Apply window functions for statistics
#             readings = readings.annotate(
#                 distance=F('distance'),
#                 min_value=Window(expression=Min('distance'), order_by='time'),
#                 max_value=Window(expression=Max('distance'), order_by='time'),
#                 average_value=Window(expression=Avg('distance'), order_by='time'),
#                 standard_deviation=Window(expression=StdDev('distance'), order_by='time')
#             )

#             # Serialize and return response data
#             data = [
#                 {
#                     'time': reading['time'],
#                     'distance': reading['distance'],
#                     'min_value': reading['min_value'],
#                     'max_value': reading['max_value'],
#                     'average_value': reading['average_value'],
#                     'standard_deviation': reading['standard_deviation'],
#                 }
#                 for reading in readings
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
