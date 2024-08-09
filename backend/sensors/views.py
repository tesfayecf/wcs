from .models import SensorReading
from data.models import Sensor
from django.db import connection
from django.db.models import F, Window, Sum, Case, When, Min, Max, Avg, StdDev
from django.db.models.functions import TruncMinute
from django.db.models.functions import Lag
from .schemas import *

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from datetime import datetime
from django.utils import timezone
from django.utils.timezone import make_aware

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

def to_timestamp(time_string):
    """
    Converts a time string to a timestamp.
    """
    naive_datetime = datetime.strptime(time_string, "%Y-%m-%dT%H:%M:%SZ")
    aware_datetime = timezone.make_aware(naive_datetime, timezone=timezone.utc)
    return aware_datetime.timestamp()

######################
### SENOR READINGS ###
######################

### GET ###
class GetSensorReadingsView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetSensorReadingsSchema(**request.data)

            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                       
            # Get sensor readings
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(data.start_time, data.end_time)
            )
            
            # Bucket readings
            readings = readings.time_bucket(
                'time', 
                f"{data.timeframe} {data.period}"
            )
            
            # Get distance values
            readings = readings.annotate(
                distance=F('distance')
            )
                        
            # Serialize sensor readings
            readings_json = [SensorReadingSchema(time=int(reading['bucket'].timestamp()), distance=reading['distance']).dict() for reading in readings]
            
            return Response(readings_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorLastReadingView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetLastSensorReadingSchema(**request.data)
            
            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get last sensor reading
            last_reading = SensorReading.objects.filter(sensor=sensor).order_by('-time').first()
            
            if not last_reading:
                return Response({'error': 'No readings for this sensor'}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize last sensor reading
            reading_json = SensorReadingSchema(time=int(last_reading.time.timestamp()), distance=last_reading.distance).dict()
            return Response(reading_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorFlowView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetSensorFlowSchema(**request.data)

            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            # Convert string times to timezone-aware datetime objects
            start_time = make_aware(data.start_time)
            end_time = make_aware(data.end_time)
            
            # Query sensor readings within the specified time range
            # Group them into time buckets and annotate with distance
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(start_time, end_time)
            ).annotate(
                bucket=TruncMinute('time')  # Use TruncMinute for minute-level buckets
            ).values('bucket').annotate(
                distance=Avg('distance')  # Use Avg to get the average distance for the bucket
            ).order_by('bucket')
            
            # Initialize variables for flow calculations
            c_inflow, c_outflow = 0, 0
            in_out_flow_data = []
            prev_distance = None
            
            # Calculate inflow and outflow for each time bucket
            for reading in readings:
                current_distance = reading['distance']
                
                if prev_distance is not None:
                    # Calculate difference from previous reading
                    diff = current_distance - prev_distance
                    # Positive difference is inflow, negative is outflow
                    inflow = max(0, diff)
                    outflow = abs(min(0, diff))
                    # Accumulate total inflow and outflow
                    c_inflow += inflow
                    c_outflow += outflow
                else:
                    # For the first reading, there's no flow yet
                    inflow, outflow = 0, 0
                
                # Append data for this time bucket to the result list
                in_out_flow_data.append({
                    'time': reading['bucket'].isoformat(),  # Convert to ISO format string
                    'distance': current_distance,
                    'inflow': c_inflow,
                    'outflow': c_outflow,
                })
                
                # Store current distance for next iteration
                prev_distance = current_distance
            
            # Return the calculated flow data
            return Response(in_out_flow_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # If any error occurs, return it with a 500 status code
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

############# RAW SQL #############
class GetSensorFlowViewRaw(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetSensorFlowSchema(**request.data)
                        
            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            # Convert string times to timezone-aware datetime objects
            start_time = make_aware(data.start_time)
            end_time = make_aware(data.end_time)
            
            # Construct the interval string
            interval = f"{data.timeframe} {data.period}"
            
            # Raw SQL query
            with connection.cursor() as cursor:
                cursor.execute("""
                    WITH buckets AS (
                        SELECT time_bucket(%s, time) AS bucket,
                               AVG(distance) AS distance
                        FROM sensor_reading
                        WHERE sensor_id = %s AND time BETWEEN %s AND %s
                        GROUP BY bucket
                        ORDER BY bucket
                    )
                    SELECT bucket,
                           distance,
                           GREATEST(0, distance - LAG(distance) OVER (ORDER BY bucket)) AS inflow,
                           GREATEST(0, LAG(distance) OVER (ORDER BY bucket) - distance) AS outflow
                    FROM buckets
                """, [interval, sensor.sensor_id, start_time, end_time])
                
                columns = [col[0] for col in cursor.description]
                readings = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Calculate cumulative inflow and outflow
            c_inflow, c_outflow = 0, 0
            in_out_flow_data = []
            
            for reading in readings:
                c_inflow += reading['inflow']
                c_outflow += reading['outflow']
                
                in_out_flow_data.append({
                    'time': reading['bucket'].isoformat(),
                    'distance': reading['distance'],
                    'inflow': c_inflow,
                    'outflow': c_outflow,
                })
            
            return Response(in_out_flow_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
###############################

class GetSensorInputFlowView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetSensorReadingsSchema(**request.data)
            
            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get readings within timeframe
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(data.start_time, data.end_time)
            )

            # Apply window function for cumulative net flow
            readings = readings.annotate(
                distance=F('distance'),
                previous_distance=Lag('distance', order_by='time'),
                inflow=Case(
                    When(previous_distance__isnull=True, then=F('distance')),
                    default=F('distance') - Lag('distance', order_by='time')
                ),
                outflow=Case(
                    When(previous_distance__isnull=True, then=0),
                    default=F('distance') - Lag('distance', order_by='time')
                ) * -1,
                cumulative_inflow=Window(
                    expression=Sum('inflow'),
                    order_by=F('time')
                ),
                cumulative_outflow=Window(
                    expression=Sum('outflow'),
                    order_by=F('time')
                )
            )

            # Serialize and return response data
            data = [
                {
                    'time': reading['time'],
                    'distance': reading['distance'],
                    'inflow': reading['cumulative_inflow'],
                    'outflow': reading['cumulative_outflow'],
                }
                for reading in readings
            ]
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSensorStatsView(APIView):
    def post(self, request):
        try:
            # Deserialize request data
            data = GetSensorReadingsSchema(**request.data)

            # Check sensor exists
            sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get readings within timeframe
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(data.start_time, data.end_time)
            )

            # Apply window functions for statistics
            readings = readings.annotate(
                distance=F('distance'),
                min_value=Window(expression=Min('distance'), order_by='time'),
                max_value=Window(expression=Max('distance'), order_by='time'),
                average_value=Window(expression=Avg('distance'), order_by='time'),
                standard_deviation=Window(expression=StdDev('distance'), order_by='time')
            )

            # Serialize and return response data
            data = [
                {
                    'time': reading['time'],
                    'distance': reading['distance'],
                    'min_value': reading['min_value'],
                    'max_value': reading['max_value'],
                    'average_value': reading['average_value'],
                    'standard_deviation': reading['standard_deviation'],
                }
                for reading in readings
            ]
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

###################
### SENSOR LOGS ###
###################

# class GetSensorLogsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorLogsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get sensor logs within timeframe
#             logs = SensorLog.objects.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Serialize and return response data
#             data = [
#                 {
#                     'time': log.time,
#                     'message': log.message,
#                 }
#                 for log in logs
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR