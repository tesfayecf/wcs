from channels.generic.websocket import AsyncWebsocketConsumer
import json

class SensorDataConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print('connection')
        await self.accept()    

    async def disconnect(self, code):
        print(f'connection closed {code}')
    
    async def receive(self, text_data=None, bytes_data=None):
        print('receive')
        print(text_data)
        try: 
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]
            sender = text_data_json["sender"]
            print(f'message: {message} - sender: {sender}')
        except json.JSONDecodeError as e:
            # Handle JSON decoding errors
            print('Error decoding JSON:', str(e))

        await self.send(text_data=json.dumps({
            'message': message,
        }))



# import json
# import asyncio
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import SensorData
# from channels.generic.websocket import AsyncWebsocketConsumer
# from django.contrib.auth.models import AnonymousUser
# from django.db import close_old_connections
# from rest_framework_simplejwt.authentication import JWTAuthentication

# class SensorDataConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # # Authenticate the WebSocket connection
#         # user = await self.get_user()

#         # if not user or isinstance(user, AnonymousUser):
#         #     # If the user is not authenticated or is an anonymous user, reject the connection.
#         #     await self.close()
#         # else:
#         #     # If the user is authenticated, accept the WebSocket connection.
#         #     await self.accept()

#         # # Start sending real-time sensor data to the client
#         # asyncio.create_task(self.send_sensor_data())
#         print("connect")
#         await self.accept()

#     async def disconnect(self, close_code):
#         # TODO: Perform any cleanup tasks when the WebSocket connection is closed
#         pass


#     async def send_sensor_data(self):
#         # Simulate sending real-time sensor data to the client
#         # Replace this with actual logic to fetch sensor data from your database or sensors.
#         data = {
#             "sensor_id": 1,
#             "water_level": 75,
#             "temperature": 25.5,
#             "humidity": 60.0
#         }

#         # Continuously send sensor data to the client while the WebSocket connection is open
#         while self.websocket.open:
#             await self.send(text_data=json.dumps(data))
#             # Add some delay (e.g., using asyncio.sleep) before sending the next data.
#             await asyncio.sleep(5)  # Send data every 5 seconds

#     # TODO: Define additional methods to handle WebSocket messages, if needed.
#     # For example, you might implement a method to receive commands from the client.

#     @database_sync_to_async
#     def get_user(self):
#         # Extract the JWT token from the query string or headers (depending on how you pass it)
#         jwt_token = self.scope.get('query_string').decode().split('token=')[1]
#         # Alternatively, you can access the token from the headers if you pass it as an authentication header.

#         # Authenticate the user using the JWT token
#         try:
#             user, _ = JWTAuthentication().authenticate_credentials(jwt_token)
#             return user
#         except:
#             return None


# class SensorDataConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # TODO: Implement authentication and permission checks for the user
#         # For example, check if the user is authenticated and allowed to access sensor data.

#         # Accept the WebSocket connection
#         await self.accept()

#         # Start a background task to fetch and transmit real-time sensor data
#         asyncio.ensure_future(self.send_realtime_sensor_data())

#     async def disconnect(self, close_code):
#         # TODO: Perform any cleanup tasks when the WebSocket connection is closed
#         pass

#     async def send_sensor_data(self):
#         # Simulate sending real-time sensor data to the client
#         # Replace this with actual logic to fetch sensor data from your database or sensors.
#         data = {
#             "sensor_id": 1,
#             "water_level": 75,
#             "temperature": 25.5,
#             "humidity": 60.0
#         }

#         # Continuously send sensor data to the client while the WebSocket connection is open
#         while self.websocket.open:
#             await self.send(text_data=json.dumps(data))
#             # Add some delay (e.g., using asyncio.sleep) before sending the next data.
#             await asyncio.sleep(5)  # Send data every 5 seconds

#     # TODO: Define additional methods to handle WebSocket messages, if needed.
#     # For example, you might implement a method to receive commands from the client.

#     async def send_realtime_sensor_data(self):
#         # Fetch and transmit real-time sensor data to the client
#         while self.websocket.is_open:
#             sensor_data = await self.get_latest_sensor_data()
#             if sensor_data:
#                 await self.send(text_data=json.dumps(sensor_data))
#             await asyncio.sleep(1)  # Delay to control the data transmission rate

#     @database_sync_to_async
#     def get_latest_sensor_data(self):
#         # This method fetches the latest sensor data from the database
#         # You should customize this query based on your sensor data model structure
#         latest_data = SensorData.objects.order_by('-timestamp').first()
#         if latest_data:
#             return {
#                 'timestamp': latest_data.timestamp.timestamp(),
#                 'water_level': latest_data.water_level,
#                 'temperature': latest_data.temperature,
#                 'humidity': latest_data.humidity,
#                 # Add more sensor data fields as needed
#             }
#         return None
