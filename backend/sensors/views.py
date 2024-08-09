# import numpy as np
# import pandas as pd
from datetime import datetime
# from statsmodels.tsa.seasonal import STL
# from scipy.stats import linregress, zscore
from timescale.db.models.expressions import TimeBucket

from django.db import connection
from django.db.models import F, Window, Sum, Case, When, Min, Max, Avg, StdDev, RowRange
from django.db.models.functions import TruncMinute, TruncHour, TruncDay, TruncMonth, TruncYear, TruncDate
from django.db.models.functions import Lag
from django.utils import timezone
from django.utils.timezone import make_aware
# from django.db.models.window import Window

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .schemas import *
from .models import SensorReading
from data.models import Sensor

# TODO: Create materialized views

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
            readings_json = [SensorReadingSchema(time=int(reading['bucket'].timestamp()), distance=reading['distance']).model_dump() for reading in readings]
            
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
            reading_json = SensorReadingSchema(time=int(last_reading.time.timestamp()), distance=last_reading.distance).model_dump()
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
            
            # Use TimescaleDB's time_bucket function
            readings = SensorReading.timescale.filter(
                sensor=sensor,
                time__range=(start_time, end_time)
            ).annotate(
                bucket=TimeBucket('time', f"{data.timeframe} {data.period}")  # TimescaleDB function
            ).values('bucket').annotate(
                distance=Avg('distance')
            ).order_by('bucket')
            
            # Calculate inflow and outflow
            c_inflow, c_outflow = 0, 0
            in_out_flow_data = []
            prev_distance = None
            
            for reading in readings:
                current_distance = reading['distance']
                
                if prev_distance is not None:
                    diff = current_distance - prev_distance
                    inflow = max(0, diff)
                    outflow = abs(min(0, diff))
                    c_inflow += inflow
                    c_outflow += outflow
                else:
                    inflow, outflow = 0, 0
                
                in_out_flow_data.append({
                    'time': reading['bucket'].isoformat(),
                    'distance': current_distance,
                    'inflow': c_inflow,
                    'outflow': c_outflow,
                })
                
                prev_distance = current_distance
            
            return Response(in_out_flow_data, status=status.HTTP_200_OK)
        
        except Exception as e:
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

# class GetSensorDailyStatsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Calculate daily statistics
#             daily_stats = readings.annotate(
#                 day=TruncDay('time')
#             ).values('day').annotate(
#                 min_distance=Min('distance'),
#                 max_distance=Max('distance'),
#                 average_distance=Avg('distance')
#             ).order_by('day')

#             # Serialize and return response data
#             data = [
#                 {
#                     'date': stat['day'].isoformat(),
#                     'min_distance': stat['min_distance'],
#                     'max_distance': stat['max_distance'],
#                     'average_distance': stat['average_distance'],
#                 }
#                 for stat in daily_stats
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorHourlyStatsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Calculate hourly statistics
#             hourly_stats = readings.annotate(
#                 hour=TruncHour('time')
#             ).values('hour').annotate(
#                 min_distance=Min('distance'),
#                 max_distance=Max('distance'),
#                 average_distance=Avg('distance')
#             ).order_by('hour')

#             # Serialize and return response data
#             data = [
#                 {
#                     'hour': stat['hour'].isoformat(),
#                     'min_distance': stat['min_distance'],
#                     'max_distance': stat['max_distance'],
#                     'average_distance': stat['average_distance'],
#                 }
#                 for stat in hourly_stats
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorMonthlyStatsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Calculate monthly statistics
#             monthly_stats = readings.annotate(
#                 month=TruncMonth('time')
#             ).values('month').annotate(
#                 min_distance=Min('distance'),
#                 max_distance=Max('distance'),
#                 average_distance=Avg('distance')
#             ).order_by('month')

#             # Serialize and return response data
#             data = [
#                 {
#                     'month': stat['month'].isoformat(),
#                     'min_distance': stat['min_distance'],
#                     'max_distance': stat['max_distance'],
#                     'average_distance': stat['average_distance'],
#                 }
#                 for stat in monthly_stats
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorYearlyStatsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Calculate yearly statistics
#             yearly_stats = readings.annotate(
#                 year=TruncYear('time')
#             ).values('year').annotate(
#                 min_distance=Min('distance'),
#                 max_distance=Max('distance'),
#                 average_distance=Avg('distance')
#             ).order_by('year')

#             # Serialize and return response data
#             data = [
#                 {
#                     'year': stat['year'].isoformat(),
#                     'min_distance': stat['min_distance'],
#                     'max_distance': stat['max_distance'],
#                     'average_distance': stat['average_distance'],
#                 }
#                 for stat in yearly_stats
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorPercentilesView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             )

#             # Calculate percentiles
#             percentiles = readings.aggregate(
#                 p10=PercentileCont(0.10, field=F('distance')),
#                 p25=PercentileCont(0.25, field=F('distance')),
#                 p50=PercentileCont(0.50, field=F('distance')),
#                 p75=PercentileCont(0.75, field=F('distance')),
#                 p90=PercentileCont(0.90, field=F('distance'))
#             )

#             return Response(percentiles, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorTrendAnalysisView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             ).order_by('time')

#             # Prepare data for linear regression
#             times = np.array([reading.time.timestamp() for reading in readings])
#             distances = np.array([reading.distance for reading in readings])

#             # Perform linear regression
#             slope, intercept, r_value, p_value, std_err = linregress(times, distances)

#             # Create trend line
#             trend_line = slope * times + intercept

#             # Prepare response data
#             data = {
#                 'slope': slope,
#                 'intercept': intercept,
#                 'r_value': r_value,
#                 'p_value': p_value,
#                 'std_err': std_err,
#                 'trend_line': trend_line.tolist()
#             }

#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorRollingStatisticsView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Convert string times to timezone-aware datetime objects
#             start_time = make_aware(data.start_time)
#             end_time = make_aware(data.end_time)
            
#             # Calculate rolling statistics
#             window_size = int(data.window_size)  # Window size in minutes
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(start_time, end_time)
#             ).annotate(
#                 rolling_mean=Window(
#                     expression=Avg('distance'),
#                     partition_by=[TruncDate('time')],
#                     order_by=F('time').asc(),
#                     frame=RowRange(start=-window_size, end=0)
#                 ),
#                 rolling_stddev=Window(
#                     expression=StdDev('distance'),
#                     partition_by=[TruncDate('time')],
#                     order_by=F('time').asc(),
#                     frame=RowRange(start=-window_size, end=0)
#                 )
#             )

#             # Serialize and return response data
#             data = [
#                 {
#                     'time': reading['time'].isoformat(),
#                     'distance': reading['distance'],
#                     'rolling_mean': reading['rolling_mean'],
#                     'rolling_stddev': reading['rolling_stddev'],
#                 }
#                 for reading in readings
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorSeasonalDecompositionView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             ).order_by('time')

#             # Prepare data for STL decomposition
#             df = pd.DataFrame(list(readings.values('time', 'distance')))
#             df.set_index('time', inplace=True)
#             df.index = pd.to_datetime(df.index, unit='s')  # Convert to datetime
#             df = df.asfreq('D')  # Resample to daily frequency

#             # Perform STL decomposition
#             stl = STL(df['distance'], period=365)
#             result = stl.fit()

#             # Prepare response data
#             decomposition = {
#                 'trend': result.trend.dropna().tolist(),
#                 'seasonal': result.seasonal.dropna().tolist(),
#                 'residual': result.resid.dropna().tolist(),
#             }

#             return Response(decomposition, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class GetSensorAnomalyDetectionView(APIView):
#     def post(self, request):
#         try:
#             # Deserialize request data
#             data = GetSensorReadingsSchema(**request.data)

#             # Check sensor exists
#             sensor = Sensor.objects.filter(sensor_id=data.sensor_id, tank__group__user=request.user).first()
#             if not sensor:
#                 return Response({'error': 'Sensor does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#             # Get readings within timeframe
#             readings = SensorReading.timescale.filter(
#                 sensor=sensor,
#                 time__range=(data.start_time, data.end_time)
#             ).order_by('time')

#             # Prepare data for anomaly detection
#             distances = np.array([reading.distance for reading in readings])
#             z_scores = zscore(distances)

#             # Detect anomalies based on z-score threshold
#             anomaly_threshold = 3
#             anomalies = readings.filter(distance__in=[distances[i] for i in range(len(z_scores)) if abs(z_scores[i]) > anomaly_threshold])

#             # Serialize and return response data
#             data = [
#                 {
#                     'time': reading.time.isoformat(),
#                     'distance': reading.distance,
#                     'z_score': z_scores[i]
#                 }
#                 for i, reading in enumerate(readings)
#                 if abs(z_scores[i]) > anomaly_threshold
#             ]
#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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