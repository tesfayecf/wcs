from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
from channels.db import database_sync_to_async
import random

class SensorDataConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = await self.get_user()
        print(user)

        if not user:
            await self.close()
        else:
            await self.accept()

        print("connected")
        self.websocket_connect = True

    async def disconnect(self, code):
        print(f'connection closed {code}')
        self.websocket_connect = False
    
    async def receive(self, text_data=None, bytes_data=None):
        print('received')
        print(text_data)
        try: 
            text_data_json = json.loads(text_data)
            timestamp = text_data_json["timestamp"]
            senosor_id = text_data_json["sensor_id"]
            message = text_data_json["message"]
            print(f'timestamp: {timestamp} - senosor_id: {senosor_id} - message: {message}')
        except json.JSONDecodeError as e:
            # Handle JSON decoding errors
            print('Error decoding JSON:', str(e))

        # await self.send(text_data=json.dumps({
        #     'message': message,
        # }))
        asyncio.create_task(self.send_sensor_data(senosor_id))
    
    async def send_sensor_data(self, senosor_id):
        # Simulate sending real-time sensor data to the client
        # Replace this with actual logic to fetch sensor data from your database or sensors.


        # Continuously send sensor data to the client while the WebSocket connection is open
        while self.websocket_connect:
            data = {
                "sensor_id": senosor_id,
                "water_level": random.randint(1, 100),
                "temperature": random.randint(1, 100),
                "humidity": random.randint(1, 100),
                "status": "OK",
            }
            await self.send(text_data=json.dumps(data))
            # Add some delay (e.g., using asyncio.sleep) before sending the next data.
            await asyncio.sleep(5)  # Send data every 5 seconds


    @database_sync_to_async
    def get_user(self):
        jwt_token = self.scope.get('query_string').decode().split('token=')[1]
        try:
            validated_token = JWTAuthentication().get_validated_token(jwt_token)
            user, _ = JWTAuthentication().get_user(validated_token), validated_token
            return user
        except:
            return None
    

# import json
# import asyncio
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.contrib.auth.models import AnonymousUser
# from rest_framework_simplejwt.authentication import JWTAuthentication

# class SensorDataConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         user = await self.get_user()

#         if not user or isinstance(user, AnonymousUser):
#             await self.close()
#         else:
#             await self.accept()

#         print("connected")
#         await self.accept()

#     async def disconnect(self, code):
#         print(f'connection closed {code}')
    
#     async def receive(self, text_data=None, bytes_data=None):
#         print('receive')
#         print(text_data)
#         try: 
#             text_data_json = json.loads(text_data)
#             message = text_data_json["message"]
#             sender = text_data_json["sender"]
#             print(f'message: {message} - sender: {sender}')
#         except json.JSONDecodeError as e:
#             # Handle JSON decoding errors
#             print('Error decoding JSON:', str(e))

#         asyncio.create_task(self.send_sensor_data())
    
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
#         while self.websocket_connect:
#             await self.send(text_data=json.dumps(data))
#             # Add some delay (e.g., using asyncio.sleep) before sending the next data.
#             await asyncio.sleep(5)  # Send data every 5 seconds

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