import paho.mqtt.client as mqtt
import os, subprocess, json, sys, time, datetime
from sensors.MQTT.utils import TOPICS, JSON_KEYS, enum_to_string


class MqttManager:
    _instance = None
    version = 51 # 4.4 of 5.1
    
    ############## CONSTRUCTOR ##############
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttManager, cls).__new__(cls)
            cls._instance._initialized = False

        return cls._instance
    
    ############## START CONNECTION ##############
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

    ############## CONFIGURE CONNECTION ##############
    def config(self):
        # test
        self.subscribe('test_')
        # subscribe to general topics
        self.subscribe(TOPICS.REGISTER_TOPIC)

        # self.subscribe('b1726b2b1acdaf030ab9db79805edd58/data')

    ############## CONNECTION CALLBACKS ##############
    def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
                print(f"Client: ${client}")
                print(f"Userdata:  ${userdata}")
                print(f"Flags:  ${flags}")
                print(f"Return Code:  ${rc}\n")
            else:
                print("Failed to connect, return code %d\n", rc)

    def on_message(self, client, userdata, message):
        payload = message.payload.decode('utf-8')
        print(f'Received message on topic: {message.topic}')
        print(f'Received message on topic: {message.payload.decode("utf-8")}')
        if (message.topic == TOPICS.REGISTER_TOPIC):
            self.registerSensor(payload)

    ############## MANAGE SENSORS ##############
    ## - own database
    ## - own manager
    def registerSensor(self, payload):
        authenticated = self.authenticateSensor(payload)
        if (authenticated):
            from sensors.models import Sensor
            
            # Extract sensor id
            try:
                data = json.loads(payload)
                sensor_id = data[enum_to_string(JSON_KEYS.SENSOR_ID)]
            except:
                print("Invalid payload")
                return

            # Register sensor into database
            try:
                sensor = Sensor.objects.get(serial_number=sensor_id)
                sensor.last_start = datetime.now()
                sensor.is_active = True
                sensor.save()
            except Sensor.DoesNotExist:
                print("Sensor not found")
                return

            # If valid sensor, subscribe to data topic
            self.subscribe(sensor_id + "/data")

    def authenticateSensor(self, payload):
        # Authentication process
        return True
    
    ############## MANAGE CONNECTION ##############
    def subscribe(self, topic):
        if self.mqtt_client.is_connected():
            self.mqtt_client.subscribe(topic)
            print(f'Subscribed to topic {topic}')
        else:
            print("MQTT Client not connected")

    def publish(self, data, topic, qos=0):
        if self.mqtt_client.is_connected():
            self.mqtt_client.publish(topic, data, qos=qos)
            print(f'Published data: {data} on topic: {topic}')

    def disconnect(self):
        if self.mqtt_client.is_connected():
            self.mqtt_client.disconnect()
            print("Disconnected from MQTT broker")

    def cleanup(self):
        self.disconnect()
        self.mqtt_client.loop_stop()

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