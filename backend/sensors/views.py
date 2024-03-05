from .models import SensorReading
from data.models import Group, Tank, Sensor
from django.db.models import Q, F, Window, Sum  # Import for complex filtering, calculations, and window functions
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
            sensor = Sensor.objects.filter(pk=data.id, tank__group__user=request.user).first()
            if not sensor:
                return Response({'Bad Request': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Get last sensor reading
            last_reading = SensorReading.timescale.last(sensor=sensor)
            
            # Serialize last sensor reading
            serializer = SensorReadingSchema(**to_dict(last_reading))
            return Response(serializer.data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        # # Filter by sensor, group, timeframe, and potentially other criteria
        # sensor_id = request.GET.get('sensor')
        # group_name = request.GET.get('group')
        # start_time = request.GET.get('start_time')
        # end_time = request.GET.get('end_time')
        # min_distance = request.GET.get('min_distance')  # Example for filtering by minimum distance
        # max_distance = request.GET.get('max_distance')  # Example for filtering by maximum distance

        # filters = Q()
        # if sensor_id:
        #     filters &= Q(sensor__sensor_id=sensor_id)
        # if group_name:
        #     filters &= Q(sensor__tank__group__name=group_name)
        # if start_time and end_time:
        #     filters &= Q(time__range=(start_time, end_time))
        # if min_distance:
        #     filters &= Q(distance__gte=min_distance)  # Filter by distance greater than or equal to minimum
        # if max_distance:
        #     filters &= Q(distance__lte=max_distance)  # Filter by distance less than or equal to maximum

        # readings = SensorReading.objects.filter(filters).select_related('sensor', 'sensor__tank')

        # # Calculate water height, rolling averages, or other derived fields
        # for reading in readings:
        #     reading.water_height = distance_to_height(reading.distance, reading.sensor.tank.capacity)

        #     # Example for calculating rolling average distance over a window (adjust window size as needed)
        #     window = Window(duration=timezone.timedelta(minutes=10))  # 10-minute window
        #     reading.rolling_avg_distance = readings.filter(sensor=reading.sensor).order_by('time').annotate(
        #         rolling_avg_distance=F('distance').over(window=window)
        #     ).last().rolling_avg_distance or None

        # serializer = SensorReadingSerializer(readings, many=True)
        # return Response(serializer.data)

# @api_view(['GET'])
# def net_inflow_outflow(request, tank_id, start_time, end_time):
#     """
#     API endpoint for calculating net inflow/outflow for a specific tank, leveraging Timescale functions.

#     Args:
#         tank_id (int): ID of the tank.
#         start_time (str): Start time for the timeframe (format: YYYY-MM-DD HH:MM:SS).
#         end_time (str): End time for the timeframe (format: YYYY-MM-DD HH:MM:SS).

#     Returns:
#         Response: JSON object containing net inflow/outflow data.
#     """

#     try:
#         tank = Tank.objects.get(pk=tank_id)
#     except Tank.DoesNotExist:
#         return Response({"error": "Tank with ID {} not found".format(tank_id)}, status=status.HTTP_404_NOT_FOUND)

#     # Leverage Timescale's time_bucket function for efficient aggregation
#     time_bucket = '1 hour'  # Adjust time bucket interval as needed
#     timescale_query = """
#         SELECT time_bucket('{}', sr.time) AS time_bucket,
#                SUM(CASE WHEN distance IS NULL THEN 0 ELSE distance END) AS total_outflow
#         FROM {}_{} sr
#         WHERE sr.time >= %s AND sr.time < %s
#         GROUP BY time_bucket
#         ORDER BY time_bucket;
#     """.format(time_bucket, SensorReading._meta.db_table, SensorReading._meta.model_name)

#     # Execute the Timescale query using raw SQL
#     cursor = connection.cursor()
#     cursor.execute(timescale_query, [start_time, end_time])
#     results = cursor.fetchall()

#     inflow_data = []  # Assume separate inflow data source or calculations
#     net_inflow_outflow = []
#     for row in results:
#         time_bucket, total_outflow = row
#         inflow = inflow_data[results.index(row)] if inflow_data else 0  # Handle potential lack of inflow data
#         net_inflow_outflow.append({
#             "time_bucket": time_bucket.isoformat(),
#             "total_outflow": total_outflow,
#             "inflow": inflow,
#             "net_inflow_outflow": inflow - total_outflow
#         })

#     return Response(net_inflow_outflow)

# @api_view(['GET'])
# def water_distribution(request, group_name, start_time, end_time):
#     """
#     API endpoint for calculating water distribution between sensors of the same group, leveraging Timescale functions.

#     Args:
#         group_name (str): Name of the tank group.
#         start_time (str): Start time for the timeframe (format: YYYY-MM-DD HH:MM:SS).
#         end_time (str): End time for the timeframe (format: YYYY-MM-DD HH:MM:SS).

#     Returns:
#         Response: JSON object containing water distribution data for each sensor in the group.
#     """

#     try:
#         group = Group.objects.get(name=group_name)
#     except Group.DoesNotExist:
#         return Response({"error": "Group with name '{}' not found".format(group_name)}, status=status.HTTP_404_NOT_FOUND)

#     # Leverage Timescale's time_bucket function and window functions for efficient aggregation
#     time_bucket = '1 hour'  # Adjust time bucket interval as needed
#     timescale_query = """
#         SELECT time_bucket('{}', sr.time) AS time_bucket,
#                sensor_id,
#                AVG(CASE WHEN distance IS NULL THEN tank_capacity ELSE tank_capacity - distance END) AS average_water_height
#         FROM {}_{} sr
#         INNER JOIN {}_{} tank ON tank.id = sr.sensor_tank_id
#         WHERE sr.time >= %s AND sr.time < %s
#           AND tank.group_id = %s
#         GROUP BY time_bucket, sensor_id
#         ORDER BY time_bucket, sensor_id;
#     """.format(time_bucket, SensorReading._meta.db_table, SensorReading._meta.model_name, Tank._meta.db_table, Tank._meta.model_name)

#     # Execute the Timescale query using raw SQL
#     cursor = connection.cursor()
#     cursor.execute(timescale_query, [start_time, end_time, group.id])
#     results = cursor.fetchall()

#     water_distribution = {}
#     for row in results:
#         time_bucket, sensor_id, average_water_height = row
#         time_bucket_str = time_bucket.isoformat()
#         if time_bucket_str not in water_distribution:
#             water_distribution[time_bucket_str] = {}
#         water_distribution[time_bucket_str][sensor_id] = {
#             "average_water_height": average_water_height
#         }

#     return Response(water_distribution)
