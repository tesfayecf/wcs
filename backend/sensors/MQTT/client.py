import time
import json
from math import pow

from utils.connection import TOPICS, JSON_KEYS, ETS
from utils.authentication import generate_prime, get_primitive_root, generate_random
from datetime import datetime

class MqttClient:
    def __init__(self, server, sensor_id):
        self.server = server
        self.sensor_id = sensor_id 

        self.has_keys = False
        self.authencticated = False
        self.registered = False

        self.server_private_key = None
        self.connection_key = None
        self.G_public_key = None
        self.N_public_key = None
    
    ############## AUTHENTICATION ##############
    def send_keys(self) -> bool:
        self.N_public_key = generate_prime(512)
        self.G_public_key = get_primitive_root(self.N_public_key)
        self.server_private_key = generate_random(self.N_public_key)

        server_public_key = pow(self.G_public_key, self.server_private_key, self.N_public_key)

        # Create json 
        config = {
            ETS(JSON_KEYS.SENSOR_ID): self.sensor_id,
            ETS(JSON_KEYS.TIMESTAMP): int(datetime.now().timestamp()),
            ETS(JSON_KEYS.PUBLIC_KEY): server_public_key,
            ETS(JSON_KEYS.N_PUBLIC_KEY): self.N_public_key,
            ETS(JSON_KEYS.G_PUBLIC_KEY): self.G_public_key,
        }

       # Convert json to string
        config = json.dumps(config)
        self._send_auth(config)
    
    def set_connection_key(self, n, g, client_public_key):
        # Check n and g are equal
        if n != self.N_public_key or g != self.G_public_key:
            raise Exception("Invalid n or g")

        connection_key = pow(client_public_key, self.server_private_key, self.N_public_key)
        self.connection_key = connection_key
        self.has_keys = True

    ############## REGISTER ##############
    def register(self) -> bool:
        from sensors.models import Sensor

         # Add connection to the database
        try:
            sensor = Sensor.objects.get(sensor_id=self.sensor_id)
            sensor.is_active = True
            sensor.start()
            sensor.save()
        except Sensor.DoesNotExist:
            raise Exception("Sensor not found")

        # Return data to sensor
        # Send registration info to sensor during 10 seconds until sensor responds
        while self.registered == False:
            # Send registration info to sensor
            try:
                current_time = int(datetime.now().timestamp())
                config = {
                    ETS(JSON_KEYS.SENSOR_ID): self.sensor_id,
                    ETS(JSON_KEYS.TIMESTAMP): current_time,
                }
                self._send_config(str(config))
            except Exception as e:
                raise Exception(f"Error sending config: {e}")
            # Wait for sensor response
            time.sleep(1)


       
        
        

        
        return True

    ############## SUBSCRIBE ##############
    def subscribe(self) -> bool:
        # TODO: multplic subscribe at once
        
        # Subscribe to data topics
        data_topic = self.sensor_id + "/" + TOPICS.DATA_TOPIC
        self.server.subscribe(data_topic)

        # Subscribe to status topic
        status_topic = self.sensor_id + "/" + TOPICS.STATUS_TOPIC
        self.server.subscribe(status_topic)
        
        return True

    # Private methods
    def _send_config(self, config):
        topic = self.sensor_id + "/" + TOPICS.CONFIG_TOPIC
        self.server.publish(topic, config)

    def _send_auth(self, auth):
        topic = self.sensor_id + "/" + TOPICS.AUTH_TOPIC
        self.server.publish(topic, auth)

