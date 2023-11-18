from sensors.MQTT.utils import TOPICS, JSON_KEYS, enum_to_string
from datetime import datetime

class MqttClient:
    def __init__(self, server, sensor_id):
        self.server = server
        self.sensor_id = sensor_id
    
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
        try:
            topic = self.sensor_id + "/" + TOPICS.CONFIG_TOPIC
            current_time = int(datetime.now().timestamp())
            data = {
                enum_to_string(JSON_KEYS.SENSOR_ID): self.sensor_id,
                enum_to_string(JSON_KEYS.SENSOR_TIME): current_time,
            }
            self.server.publish(topic, str(data))
        except Exception as e:
            raise Exception(f"Error sending config: {e}")

    def send_data(self, data):
        topic = self.sensor_id + "/" + TOPICS.DATA_TOPIC
        self.server.publish(topic, data)
    
    def send_config(self, config):
        topic = self.sensor_id + "/" + TOPICS.CONFIG_TOPIC
        self.server.publish(topic, config)

