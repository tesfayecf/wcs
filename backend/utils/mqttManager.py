import paho.mqtt.client as mqtt
import os
import subprocess
import logging
import json
import datetime

class MqttManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttManager, cls).__new__(cls)
            cls._instance._initialized = False
            cls._instance.logger = logging.getLogger(__name__)
            cls._instance.logger.setLevel(logging.DEBUG)
            cls._instance.logger.addHandler(logging.StreamHandler())

        return cls._instance

    def start(self):
        if self._initialized:
            return
    
        # start the broker server
        if (os.environ.get('DEVELOPMENT_MODE')):
            self._checkSatus()

        self.mqtt_client = mqtt.Client(client_id="server", protocol=5)
        self.mqtt_client.user_data_set(userdata={'username': "server"})

        self.mqtt_client.on_message = self.on_message

        try:
            # Add support for authentication if required
            # self.mqtt_client.username_pw_set(username, password)
            
            self.mqtt_client.connect(os.environ.get('MQTT_BROKER_HOST'), int(os.environ.get('MQTT_BROKER_PORT')), clean_start=False)
            self.mqtt_client.loop_start()
            self._initialized = True
        except Exception as e:
            self.logger.error(f"MQTT connection error: {e}")

    def setBasicTopics(self):
        self.subscribe('server/register')

    def on_message(self, client, userdata, message):
        payload = message.payload.decode('utf-8')
        self.logger.info(f'Received message on topic: {message.topic}')
        if (message.topic == "server/register"):
            self.registerSensor(payload)

    def registerSensor(self, payload):
        authenticated = self.authenticateSensor(payload)
        if (authenticated):
            from sensors.models import Sensor
            data = json.loads(payload)
            sensor_id = data['sensor_id']
            # try:
            #     sensor = Sensor.objects.get(serial_number=sensor_id)
            #     sensor.last_start = datetime.now()
            #     sensor.save()
            # except Sensor.DoesNotExist:
            #     self.authenticateSensor(payload)
            #     pass

    def authenticateSensor(self, payload):
        return False

    def subscribe(self, topic):
        if self.mqtt_client.is_connected():
            self.mqtt_client.subscribe(topic)
            self.logger.info(f'Subscribed to topic {topic}')

    def publish(self, data, topic, qos=0):
        if self.mqtt_client.is_connected():
            self.mqtt_client.publish(topic, data, qos=qos)
            self.logger.info(f'Published data: {data} on topic: {topic}')

    def disconnect(self):
        if self.mqtt_client.is_connected():
            self.mqtt_client.disconnect()
            self.logger.info("Disconnected from MQTT broker")

    def cleanup(self):
        self.disconnect()
        self.mqtt_client.loop_stop()

    # JUST LOCAL DEV MODE
    def _checkSatus(self):
        os.chdir('C:/emqx/bin/')
        result = subprocess.run('.\emqx.cmd ping', stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        if 'pong' in result.stdout:
            self.logger.info("MQTT server is active")
        else:
            self.logger.info("MQTT server is not active")
            self.logger.info("Starting MQTT server")
            subprocess.run('.\emqx.cmd start', shell=True)