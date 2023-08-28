from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
from channels.db import database_sync_to_async
import random

class SensorDataConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = await self.get_user()
        if not user:
            await self.close()
        else:
            await self.accept()
        self.websocket_connect = True
        # asyncio.create_task(self.send_sensor_data(senosor_id))

    async def disconnect(self, code):
        self.websocket_connect = False
    
    async def receive(self, text_data=None, bytes_data=None):
        try: 
            text_data_json = json.loads(text_data)
            timestamp = text_data_json["timestamp"]
            senosor_id = text_data_json["sensor_id"]
            message = text_data_json["message"]
            print(f'timestamp: {timestamp} - senosor_id: {senosor_id} - message: {message}')
        except json.JSONDecodeError as e:
            print('Error decoding JSON:', str(e))

        asyncio.create_task(self.send_sensor_data(senosor_id))
    
    async def send_sensor_data(self, senosor_id):
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