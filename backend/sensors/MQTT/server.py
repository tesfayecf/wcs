import paho.mqtt.client as mqtt

from typing import Dict
import os, subprocess, json, sys, time
from utils.connection import TOPICS, JSON_KEYS, ETS
from sensors.MQTT.client import MqttClient

class MqttServer:
    _instance = None
    version = 51 # 4.4 of 5.1
    sensors: Dict[str, MqttClient] = {}
    last_message_info = None

    ############## CONSTRUCTOR ##############
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttServer, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance  

    ############## START SERVER ##############
    def start(self):
        try:
            if self._initialized:
                return
        
            if (os.environ.get('DEVELOPMENT_MODE')):
                self._checkStatus()

            self.mqtt_client = mqtt.Client(client_id=os.environ.get('MQTT_CLIENT_ID'), protocol=5)
            self.mqtt_client.user_data_set(userdata={'username': os.environ.get('MQTT_CLIENT_USERNAME')})


            if self.mqtt_client.connect(os.environ.get('MQTT_BROKER_HOST'), int(os.environ.get('MQTT_BROKER_PORT'))) != 0:
                raise Exception("Error connecting to MQTT broker")

            # self.mqtt_client.on_connect = self.on_connect
            self.mqtt_client.on_message = self.on_message

            self.mqtt_client.loop_start()

            self._initialized = True

            # BUG: Wait for server to connect to broker
            time.sleep(1)
        except Exception as e:
            print(f"MQTT connection error: {e}")

    ############## CONFIGURE SERVER ##############
    def config(self):
        try:
            # test
            self.subscribe('test_')
            # subscribe to general topics
            self.subscribe(TOPICS.REGISTER_TOPIC)

            # self.subscribe('b1726b2b1acdaf030ab9db79805edd58/data')
        except Exception as e:
            print(f"MQTT config error: {e}")

    ############## CALLBACKS ##############
    def on_message(self, client, userdata, message):
        try:
            payload = message.payload.decode("utf-8")
            print(f"Received data: {payload} on topic: {message.topic}")

            # Register sensor
            if (message.topic == TOPICS.REGISTER_TOPIC):
                self.register(payload)
            elif (TOPICS.AUTH_TOPIC in message.topic):
                self.authenticate(payload)
                
        except Exception as e:
            print(f"MQTT on_message error: {e}")

    ############## MANAGE SENSORS ##############
    def register(self, payload):
        # Get sensor info
        try:
            data = json.loads(payload)
            sensor_id = data[ETS(JSON_KEYS.SENSOR_ID)]
        except:
            print("Invalid payload")
            return

        # Create client object
        sensor = MqttClient(self, sensor_id)

        # Send authentication keys to client
        try:
            sensor.send_keys()
        except Exception as e: 
            print(f"Authentication error: {e}")
            return
        
        self.sensors[sensor_id] = sensor
            
        # # Register sensor new connection
        # try:
        #     sensor.register()
        # except Exception as e:
        #     print(f"Registration error: {e}")
        #     return

        # # Subscribe to sensor topics
        # try:
        #     sensor.subscribe()
        # except Exception as e:
        #     print(f"Subscription error: {e}")
        #     return

    def authenticate(self, payload):
        # Check payload has all the required keys
        try:
            data = json.loads(payload)
            sensor_id = data[ETS(JSON_KEYS.SENSOR_ID)]
            timestamp = data[ETS(JSON_KEYS.TIMESTAMP)]
            g_public_key = data[ETS(JSON_KEYS.G_PUBLIC_KEY)]
            n_public_key = data[ETS(JSON_KEYS.N_PUBLIC_KEY)]
            client_public_key = data[ETS(JSON_KEYS.PUBLIC_KEY)]
        except:
            print("Invalid payload")
            return
        
        try:
            sensor = self.sensors[sensor_id]
        except:
            print("Sensor not found")
            return
        
        sensor.set_connection_key(n_public_key, g_public_key, client_public_key)
        


    ############## MANAGE CONNECTION ##############
    def subscribe(self, topic):
        if not self.mqtt_client.is_connected():
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

    def publish(self, topic, data, qos=0):
        if not topic or len(topic) == 0 or '#' in topic or '+' in topic:
            raise ValueError("Invalid topic")

        if qos not in {0, 1, 2}:
            raise ValueError("Invalid QoS level. Must be 0, 1, or 2.")

        if not self.mqtt_client.is_connected():
            print("Error: Client is not connected.")
            return

        try:
            self.last_message_info = self.mqtt_client.publish(topic, data, qos=qos)
            print(f"Published data: {data} on topic: {topic}")

            # You can use the following lines if you want to wait for the message to be delivered
            while not self.last_message_info.is_published():
                time.sleep(0.1)
            print("Message delivered.")

        except ValueError as ve:
            print(f"Error publishing message: {ve}")

    def disconnect(self):
        if self.mqtt_client.is_connected():
            self.mqtt_client.disconnect()
            print("Disconnected from MQTT broker")

    def cleanup(self):
        self.disconnect()
        self.mqtt_client.loop_stop()

    ############## PRIVATE METHODS #############
    def _subscribe_single_topic(self, topic):
        self.mqtt_client.subscribe(topic)
        print(f"Subscribed to topic {topic}")

    def _subscribe_single_topic_tuple(self, topic_tuple):
        if len(topic_tuple) != 2:
            raise ValueError("Invalid tuple format. It should be (topic, qos).")

        topic, qos = topic_tuple

        if not topic or not isinstance(topic, str):
            raise ValueError("Invalid topic in tuple.")

        if qos not in {0, 1, 2}:
            raise ValueError("Invalid QoS level in tuple. Must be 0, 1, or 2.")

        self.mqtt_client.subscribe(topic, qos)
        print(f"Subscribed to topic {topic} with QoS {qos}")

    # JUST LOCAL DEV MODE
    def _checkStatus(self):
        path = "C:/emqx_" + str(self.version) + "/bin/" # C:/emqx_51/bin/emqx.cmd ping
        os.chdir(path)
        result = subprocess.run('.\emqx.cmd ping', stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        if 'pong' in result.stdout:
            print("MQTT server is active")
        else:
            print("MQTT server is not active")
            sys.exit()
            # print("Starting MQTT server")
            # subprocess.run('.\emqx.cmd start', shell=True)