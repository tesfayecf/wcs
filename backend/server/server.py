import os, time, json, random
from typing import Dict, Any, Union
from dataclasses import dataclass
import paho.mqtt.client as mqtt

from data.models import Sensor
from sensors.models import SensorReading
from .types import (
    Topic, 
    MessageParam, 
    ActionParam, MetaParam,
    ActionType, 
    RegisterAction, DataAction, CommandAction
)
from .message import MQTTMessage

# Listen to signal to start server
def start_mqtt_server(sender, **kwargs):
    # Create server instance
    server = MqttServer()
    # Start server
    server.start()

@dataclass
class MqttConfig:
    host: str
    port: int
    version: str
    protocol: int
    server_username: str
    server_id: str

class MqttServer:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttServer, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.server_client = None
        self._initialized = True
        self.config = MqttConfig(
            host=os.getenv('MQTT_BROKER_HOST'),
            port=int(os.getenv('MQTT_BROKER_PORT')),
            version=os.getenv('MQTT_BROKER_VERSION'),
            protocol=int(os.getenv('MQTT_BROKER_PROTOCOL')),
            server_id=os.getenv('MQTT_SERVER_ID'),
            server_username=os.getenv('MQTT_SERVER_USERNAME'),
        )

    def start(self):
        if self.server_client and self.server_client.is_connected():
            print("MQTT server already connected")
            return

        try:
            self.server_client = mqtt.Client(
                client_id=self.config.server_id,
                protocol=int(self.config.protocol)
            )
            self.server_client.user_data_set({'username': self.config.server_username})

            self.server_client.on_connect = self.on_connect
            self.server_client.on_message = self.on_message

            if self.server_client.connect(self.config.host, int(self.config.port)) != 0:
                raise ConnectionError("Failed to connect to MQTT broker")

            self.server_client.loop_start()
            print("MQTT server started")
            
            # Wait for connection to establish
            for _ in range(10):  # Try for 5 seconds (10 * 0.5s)
                if self.server_client.is_connected():
                    break
                time.sleep(0.5)
            else:
                raise TimeoutError("Connection to MQTT broker timed out")

        except Exception as e:
            print(f"MQTT connection error: {e}")
            self.cleanup()

    # CALLBACK
    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print("Successfully connected to MQTT broker")
            self._subscribe(Topic.REGISTER)
            self.subscribe_topics()
        else:
            print(f"Failed to connect to MQTT broker. Reason code: {reason_code}")

    def on_message(self, client, userdata, message: mqtt.MQTTMessage):
        try:
            topic_parts = message.topic.split("/")
            sensor_id, topic = topic_parts[0], topic_parts[-1]

            # Parse the payload
            mqqt_msg = MQTTMessage.from_dict(topic, message.payload)

            # Check sensor id matches the topic
            if mqqt_msg.meta[MetaParam.SENSOR_ID] != sensor_id:
                raise ValueError("Sensor ID mismatch")

            # Handle topic
            handlers = {
                Topic.REGISTER: self.handle_register,
                Topic.DATA: self.handle_data,
                Topic.COMMAND: self.handle_command
            }

            handler = handlers.get(mqqt_msg.topic)
            if handler:
                handler(mqqt_msg)
            else:
                print(f"Unhandled topic: {mqqt_msg.topic}")

        except json.JSONDecodeError:
            print("Invalid JSON in message payload")
        except Exception as e:
            print(f"Error processing message: {e}")

    # REGISTER
    def handle_register(self, msg: MQTTMessage):
        sensor_id = msg.meta[MetaParam.SENSOR_ID]
        print(f"Handling register action for sensor: {sensor_id}")
        
        if msg.action == RegisterAction.NEW_SENSOR:
            # self.register_new_sensor(sensor_id, msg.payload)
            pass
        elif msg.action == RegisterAction.UPDATE_SENSOR:
            # self.update_sensor(sensor_id, msg.payload)
            pass
        elif msg.action == RegisterAction.REMOVE_SENSOR:
            # self.remove_sensor(sensor_id)
            pass
        else:
            print(f"Unknown register action: {msg.action}")

    # DATA
    def handle_data(self, msg: MQTTMessage):
        sensor_id = msg.meta[MetaParam.SENSOR_ID]
        print(f"Handling data action for sensor: {sensor_id}")
        
        if msg.action == DataAction.SENSOR_READING:
            self.log_sensor_reading(sensor_id, msg.payload)
            pass
        elif msg.action == DataAction.BATCH_READINGS:
            # self.log_batch_readings(sensor_id, msg.payload)
            pass
        elif msg.action == DataAction.ERROR_REPORT:
            # self.handle_error_report(sensor_id, msg.payload)
            pass
        else:
            print(f"Unknown data action: {msg.action}")
            
    def log_sensor_reading(self, sensor_id: str, payload: Dict[str, Any]):
        sensor = Sensor.objects.get(sensor_id=sensor_id)
        if sensor is None:
            raise ValueError("Sensor not found")
        if not sensor.is_active:
            raise ValueError("Sensor is not active")
        
        SensorReading.timescale.create(
            distance=random.uniform(0, 100), # distance=payload['action']['parameter0'],
            sensor=sensor
        )

    # COMMAND
    def handle_command(self, msg: MQTTMessage):
        sensor_id = msg.meta[MetaParam.SENSOR_ID]
        print(f"Handling command action for sensor: {sensor_id}")
        
        if msg.action == CommandAction.SET_INTERVAL:
            # self.set_sensor_interval(sensor_id, msg.payload)
            pass
        elif msg.action == CommandAction.CALIBRATE:
            # self.calibrate_sensor(sensor_id, msg.payload)
            pass
        elif msg.action == CommandAction.UPDATE_FIRMWARE:
            # self.update_sensor_firmware(sensor_id, msg.payload)
            pass
        elif msg.action == CommandAction.RESET:
            # self.reset_sensor(sensor_id)
            pass
        else:
            print(f"Unknown command action: {msg.action}")

    # PUBLISH
    def _publish(self, topic: Topic, action_type: ActionType, action: Union[RegisterAction, DataAction, CommandAction], meta: Dict[MetaParam, Any], payload: Dict[str, Any], qos: int = 0):
        if not self.server_client or not self.is_connected:
            raise ConnectionError("MQTT Client not connected")

        message = MQTTMessage(topic, action_type, action, meta, payload)
        message_dict = message.to_dict()
        message_json = json.dumps(message_dict)

        result = self.server_client.publish(f"{meta[MetaParam.SENSOR_ID]}/{topic.value}", message_json, qos=qos)
        if result.rc != mqtt.MQTT_ERR_SUCCESS:
            print(f"Failed to publish message. Result code: {result.rc}")
        else:
            print(f"Published message to topic: {topic.value}")

    # SUBSCRIBE
    def subscribe_topics(self):
        sensors = Sensor.objects.all()
        for sensor in sensors:
            self._subscribe(f"{sensor.sensor_id}/{Topic.DATA}")
            self._subscribe(f"{sensor.sensor_id}/{Topic.COMMAND}")

    def _subscribe(self, topic: Union[str, tuple, list]):
        if not self.server_client or not self.server_client.is_connected():
            raise ConnectionError("MQTT Client not connected")

        if isinstance(topic, str):
            self._subscribe_single_topic(topic)
        elif isinstance(topic, tuple):
            self._subscribe_single_topic_tuple(topic)
        elif isinstance(topic, list):
            for t in topic:
                self._subscribe_single_topic_tuple(t)
        else:
            raise ValueError("Invalid topic format")

    def _subscribe_single_topic(self, topic: str):
        self.server_client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")

    def _subscribe_single_topic_tuple(self, topic_tuple: tuple):
        if len(topic_tuple) != 2:
            raise ValueError("Invalid tuple format. Expected (topic, qos)")

        topic, qos = topic_tuple
        if not isinstance(topic, str) or qos not in {0, 1, 2}:
            raise ValueError("Invalid topic or QoS")

        self.server_client.subscribe(topic, qos)
        print(f"Subscribed to topic: {topic} with QoS: {qos}")


    def disconnect(self):
        if self.server_client and self.server_client.is_connected():
            self.server_client.disconnect()
            print("Disconnected from MQTT broker")

    def cleanup(self):
        self.disconnect()
        if self.server_client:
            self.server_client.loop_stop()
        print("MQTT server cleanup completed")