import os, time, json
import paho.mqtt.client as mqtt
from paho.mqtt.client import MQTTMessage
from .types import Topics, Actions, Types, Parameters
from data.models import Sensor
from .schemas import MQTTMessageSchema

# Listen to signal to start serever
def start_mqtt_server(sender, **kwargs):
    # Create server instance
    server = MqttServer()
    # Start server
    server.start()

class MqttServer:
    _instance = None
    version = os.environ.get('MQTT_BROKER_VERSION')
    connections = {}
    server_client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttServer, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance  

    def start(self):
        try:
            if self._initialized:
                return
            
            if self.server_client and self.server_client.is_connected():
                print("MQTT server already connected")
                return

            # Connect to mqtt broker
            self.server_client = mqtt.Client(client_id=os.environ.get('MQTT_SERVER_ID'), protocol=int(os.environ.get('MQTT_BROKER_PROTOCOL')))
            self.server_client.user_data_set(userdata={'username': os.environ.get('MQTT_SERVER_USERNAME')})

            # Check connection is established
            if self.server_client.connect(os.environ.get('MQTT_BROKER_HOST'), int(os.environ.get('MQTT_BROKER_PORT'))) != 0:
                raise Exception("Error connecting to MQTT broker")

            # Set callbacks
            self.server_client.on_connect = self.on_connect
            self.server_client.on_message = self.on_message

            self.server_client.loop_start()

            self._initialized = True
            print("MQTT server started")
            # BUG: Wait for server to connect to broker
            time.sleep(1)
        except Exception as e:
            print(f"MQTT connection error: {e}")

    def on_connect(self, client, userdata, flags, reason_code, properties):
        # Subscribe to register topic
        self.subscribe(Topics.REGISTER)
        
        # Subscribe to sensors data topic
        sensors = Sensor.objects.all()
        for sensor in sensors:
            self.subscribe(sensor.token + "/" + Topics.DATA)
    
    def on_message(self, client, userdata, message: MQTTMessage):
        try:
            id = message.topic.split("/")[0]
            topic = message.topic.split("/")[-1]
            
            payload = self.parse_payload(message.payload)

            # Register sensor
            if (topic == Topics.REGISTER):
                self.register(id, payload)
            if (topic == Topics.DATA):
                self.log(id, payload)
        except Exception as e:
            print(f"MQTT on_message error: {e}")

    def parse_payload(self, payload):
        payload_json = json.loads(payload)
        payload_parsed = {}
        
        action = payload_json['action']
        payload_parsed['action'] = {}
        payload_parsed['action']['type'] = action[str(Parameters.ACTION_TYPE.value[0])]
        payload_parsed['action']['name'] = action[str(Parameters.ACTION_NAME.value[0])]
        # Read params
        for i in range(len(action) - 2):
            payload_parsed['action'][str('parameter') + str(i)] = action[str('p') + str(i)]
        
        metadata = payload_json['meta']
        payload_parsed['metadata'] = {}
        payload_parsed['metadata']['timestamp'] = metadata[str(Parameters.TIMESTAMP.value[0])]
        payload_parsed['metadata']['version'] = metadata[str(Parameters.VERSION.value[0])]
        payload_parsed['metadata']['sensor_id'] = metadata[str(Parameters.SENSOR_TIME.value[0])]
        payload_parsed['metadata']['message_id'] = metadata[str(Parameters.MESSAGE_ID.value[0])]
        payload_parsed['metadata']['sensor_time'] = metadata[str(Parameters.SENSOR_TIME.value[0])]
        
        return payload_parsed

    def register(self, id, payload):
        print("Registering sensor")
        pass      
    
    def log(self, id, payload):
        # Get sensor id from database based on id
        sensor = Sensor.objects.get(token=id)
        try:           
            print(payload)
        except Exception as e:
            print(f"Invalid payload: {e}")
            return  
    
    def subscribe(self, topic):
        if not self.server_client.is_connected():
            print("Error: MQTT Client not connected.")
            return

        if not topic:
            raise ValueError("Topic cannot be None or empty.")

        if not isinstance(topic, (str, tuple, list)):
            raise ValueError("Invalid topic format. It should be a string, tuple, or list.")

        if isinstance(topic, str):
            self._subscribe_single_topic(topic)
        elif isinstance(topic, tuple):
            self._subscribe_single_topic_tuple(topic)
        elif isinstance(topic, list):
            for t in topic:
                self._subscribe_single_topic_tuple(t)
        else:
            raise ValueError("Invalid topic format.")

    def _subscribe_single_topic(self, topic):
        self.server_client.subscribe(topic)
        print(f"Subscribed to topic {topic}")

    def _subscribe_single_topic_tuple(self, topic_tuple):
        if len(topic_tuple) != 2:
            raise ValueError("Invalid tuple format. It should be (topic, qos).")

        topic, qos = topic_tuple

        if not topic or not isinstance(topic, str):
            raise ValueError("Invalid topic in tuple.")

        if qos not in {0, 1, 2}:
            raise ValueError("Invalid QoS level in tuple. Must be 0, 1, or 2.")

        self.server_client.subscribe(topic, qos)
        print(f"Subscribed to topic {topic} with QoS {qos}")
        
    def publish(self, topic, data, qos=0):
        if not topic or len(topic) == 0 or '#' in topic or '+' in topic:
            raise ValueError("Invalid topic")

        if qos not in {0, 1, 2}:
            raise ValueError("Invalid QoS level. Must be 0, 1, or 2.")

        if not self.server_client.is_connected():
            print("Error: Client is not connected.")
            return

        try:
            self.last_message_info = self.server_client.publish(topic, data, qos=qos)
            print(f"Published data: {data} on topic: {topic}")

            # You can use the following lines if you want to wait for the message to be delivered
            while not self.last_message_info.is_published():
                time.sleep(0.1)
            print("Message delivered.")

        except ValueError as ve:
            print(f"Error publishing message: {ve}")

    def disconnect(self):
        if self.server_client.is_connected():
            self.server_client.disconnect()
            print("Disconnected from MQTT broker")

    def cleanup(self):
        self.disconnect()
        self.server_client.loop_stop()