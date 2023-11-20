from sensors.MQTT.utils import TOPICS, JSON_KEYS, ETS
from datetime import datetime
import time

class MqttClient:
    def __init__(self, server, sensor_id):
        self.server = server
        self.sensor_id = sensor_id
        self.authencticated = False
        self.registered = False
    
    def authencticate(self) -> bool:
        # topic = self.sensor_id + "/" + TOPICS.AUTH_TOPIC
        # self.server.publish(topic, "1")
        return True
    
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
        while self.registeredS == False:
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
    def _send_data(self, data):
        topic = self.sensor_id + "/" + TOPICS.DATA_TOPIC
        self.server.publish(topic, data)
    
    def _send_config(self, config):
        topic = self.sensor_id + "/" + TOPICS.CONFIG_TOPIC
        self.server.publish(topic, config)

