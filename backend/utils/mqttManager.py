import paho.mqtt.client as mqtt
import os
import subprocess

class MqttManager:
    _instance = None
    host = "192.168.1.13"
    port = 1883

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        # start the broker server
        self.start_broker()

        # define server client
        self.mqtt_client = mqtt.Client(client_id="server", clean_session=True)
        self.mqtt_client.user_data_set(userdata={'username': "server"})

        # define the callback function
        self.mqtt_client.on_message = self.on_message
        
        # connect to the broker
        self.mqtt_client.connect(self.host, self.port)
        
        # start the loop
        self.mqtt_client.loop_start()
        self._initialized = True
    
    def start_broker(self):
        os.chdir('C:/emqx/bin/')
        result = subprocess.run('.\emqx.cmd ping', stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        if 'pong' in result.stdout:
            print("MQTT server is active")
        else:
            print("MQTT server is not active")
            print("Starting MQTT server")
            subprocess.run('.\emqx.cmd start', shell=True)

    def on_message(self, client, userdata, message):
        # Handle incoming MQTT messages here
        payload = message.payload.decode('utf-8')
        topic = message.topic
        print(f'Received message: {payload} on topic: {topic}')

    def subscribe(self, topic):
        self.mqtt_client.subscribe(topic)
        print(f'Subscribed to topic {topic}')

    def publish(self, data, topic):
        self.mqtt_client.publish(topic, data)
        print(f'Published data: {data} on topic: {topic}')