import pandas as pd
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA

from django.db.models import F, Min, Max, Avg

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Measure, Channel, Chunk, Record
from .serializers import *

# # TODO: Create materialized views

######################
### SENSOR RECORDS ###
######################

class GetLastRecordView(APIView):
    """
    View for retrieving the last record for a sensor.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving the last record for a sensor.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving the last record for a sensor.

        Parameters:
        - request: The HTTP request object containing the sensor ID.

        Returns:
        - Response: HTTP response with the last record if found,
                    or an error message if the sensor does not exist or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetLastRecordSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects
            sensor = Sensor.objects.filter(
                pk=serializer.validated_data['sensor_id'],
                tank__id=serializer.validated_data['tank_id'],
                tank__group__id=serializer.validated_data['group_id'],
                tank__group__user=request.user
            ).first()
            if not sensor:
                return Response({"detail": "Sensor does not exist."}, status=status.HTTP_404_NOT_FOUND)

            # 3. Check for conflicts
            # 4. Perfom main operation
            record = Record.objects.filter(
                sensor=sensor, 
                channel__measure__id=serializer.validated_data['measure_id']
            ).last()
            if not record:
                return Response({"detail": "No records found."}, status=status.HTTP_404_NOT_FOUND)

            # 5. Store response data in cache
            # 6. Prepare and return response
            serializer = RecordSerializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetRecordsView(APIView):
    """
    View for retrieving sensor records based on specified parameters.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving sensor records.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving sensor records.

        Parameters:
        - request: The HTTP request object containing the input parameters.

        Returns:
        - Response: HTTP response with sensor readings if successful,
                    or an error message if validation fails or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetRecordsSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if serializer.validated_data['start_time'] > serializer.validated_data['end_time']:
                return Response({"detail": "Start time cannot be after end time."}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects
            # 3. Check for conflicts
            # 4. Perfom main operation
            base_query = Record.timescale.filter(
                channel__measure__sensor__tank__group__user=request.user,
                time__range=(serializer.validated_data['start_time'], serializer.validated_data['end_time'])
            )

            if 'tank_id' in serializer.validated_data:
                base_query = base_query.filter(channel__measure__sensor__tank__id=serializer.validated_data['tank_id'])
            else:
                base_query = base_query.filter(channel__measure__sensor__tank__group__id=serializer.validated_data['group_id'])

            query = base_query.time_bucket(
                # 'time', f"1 ${serializer.validated_data['timeframe']}"
                'time', "1 minute"
            ).values(
                'time',
                'channel__id',
                'channel__measure__id',
                'channel__measure__sensor__id'
            ).annotate(
                min=Min('value'),
                max=Max('value'),
                value=Avg('value'),
            )

            # Here we can process the readings based on the channel id (ie. convert magnituds, correct versions, etc.)
            # Maybe this can be done in the client side

            # In order to read a queryset, we have to iterate over it
            readings = []
            for row in query:
                readings.append(
                    {
                        'time': row['time'],
                        'min': row['min'],
                        'max': row['max'],
                        'value': row['value'],
                        'channel': row['channel__id'],
                        'measure': row['channel__measure__id'],
                        'sensor': row['channel__measure__sensor__id'],
                    }
                )

            # 5. Store response data in cache
            # 6. Prepare and return response
            serializer = RecordInfoSerializer(readings, many=True)           
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetRecordsFlowView(APIView):
    """
    View for retrieving sensor flow based on specified parameters.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving sensor flow.
    """

    def post(self, request):
        """
        Handles POST requests for retrieving sensor flow.

        Parameters:
        - request: The HTTP request object containing the input parameters.

        Returns:
        - Response: HTTP response with sensor flow if successful,
                    or an error message if validation fails or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetRecordsFlowSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects 
            sensor = Sensor.objects.filter(
                pk=serializer.validated_data['sensor_id'],
                tank__id=serializer.validated_data['tank_id'],
                tank__group__id=serializer.validated_data['group_id'],
                tank__group__user=request.user
            ).first()
            if not sensor:
                return Response({'error': 'Sensor not found'}, status=status.HTTP_404_NOT_FOUND)

            # 3. Check for conflicts
            # 4. Perfom main operation
            query = Record.timescale.filter(
                channel__measure__sensor=sensor,
                time__range=(serializer.validated_data['start_time'], serializer.validated_data['end_time'])
            ).time_bucket(
                'time', f"1 ${serializer.validated_data['timeframe']}"
            ).values(
                'bucket'
            ).annotate(
                start_value=F('value'),
                end_value=F('value'),
            ).order_by(
                'bucket'
            )

            flow_analysis = []
            for i in range(len(query) - 1):
                current = query[i]
                next = query[i + 1]
                change = next['start_value'] - current['end_value']
                flow_analysis.append({
                    'time': int(datetime.timestamp(current['bucket'])),
                    'input_flow': max(change, 0),
                    'output_flow': abs(min(change, 0)),
                    'net_change': change
                })

            # 5. Store response data in cache
            # 6. Prepare and return response
            serializer = RecordFlowSerializer(flow_analysis, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetRecordsTrendForecastView(APIView):
    """
    View for retrieving sensor trend forecast based on specified parameters.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for retrieving sensor trend forecast.
    """
    def post(self, request):
        """
        Handles POST requests for retrieving sensor trend forecast.

        Parameters:
        - request: The HTTP request object containing the input parameters.

        Returns:
        - Response: HTTP response with sensor trend forecast if successful,
                    or an error message if validation fails or an exception occurs.
        """
        try:
            # 1. Validate input data
            serializer = GetRecordsTrendForecastSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Retrieve necessary objects
            sensor = Sensor.objects.filter(
                pk=serializer.validated_data['sensor_id'],
                tank__id=serializer.validated_data['tank_id'],
                tank__group__id=serializer.validated_data['group_id'],
                tank__group__user=request.user
            ).first()
            if not sensor:
                return Response({'error': 'Sensor not found'}, status=status.HTTP_404_NOT_FOUND)

            # 3. Check for conflicts
            # 4. Perfom main operation
            records = Record.timescale.filter(
                channel__measure__sensor=sensor,
                time__range=(serializer.validated_data['start_time'], serializer.validated_data['end_time'])
            ).time_bucket(
                'time', f"1 ${serializer.validated_data['timeframe']}"
            ).values(
                'bucket'
            ).annotate(
                value=Avg('value')
            ).order_by(
                'bucket'
            )

            if not records or records.count() < 100:
                return Response({'error': 'Not enough records found for the specified time range'}, status=status.HTTP_404_NOT_FOUND)

            # Convert to pandas DataFrame
            df = pd.DataFrame(records)
            df.set_index('bucket', inplace=True)
            df.index = pd.to_datetime(df.index)

            # Fit ARIMA model
            model = ARIMA(df['value'], order=(1,1,1))
            results = model.fit()

            # Forecast next steps
            if (serializer.validated_data['timeframe'] == 'minute'):
                forecast_steps = 60
            elif (serializer.validated_data['timeframe'] == 'hour'):
                forecast_steps = 24
            elif (serializer.validated_data['timeframe'] == 'day'):
                forecast_steps = 31
            elif (serializer.validated_data['timeframe'] == 'week'):
                forecast_steps = 8
            elif (serializer.validated_data['timeframe'] == 'month'):
                forecast_steps = 3
            else:
                return Response({'error': 'Invalid timeframe'}, status=status.HTTP_400_BAD_REQUEST)

            # Make forecast
            forecast = results.forecast(steps=forecast_steps)

            # Prepare forecast data for response
            last_timestamp = df.index[-1]
            forecast_data = [
                {
                    'time': (last_timestamp + timedelta(hours=i+1)).isoformat(),
                    'value': forecast.iloc[i]
                }
                for i in range(forecast_steps)
            ]

            # 5. Store response data in cache
            # 6. Prepare and return response
            serializer = RecordTrendForecastSerializer(forecast_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)