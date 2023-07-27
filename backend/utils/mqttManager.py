# mqtt_manager.py

import paho.mqtt.client as mqtt

class MqttManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MqttManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.mqtt_client = mqtt.Client()
        self.mqtt_client.on_message = self.on_message
        self.mqtt_client.connect("localhost", 1883)
        self.mqtt_client.loop_start()
        self._initialized = True

    def on_message(self, client, userdata, message):
        # Handle incoming MQTT messages here
        payload = message.payload.decode('utf-8')
        topic = message.topic
        print(f'Received message: {payload} on topic: {topic}')
        # Process the message as needed

    def subscribe(self, sensor_id, topic):
        self.mqtt_client.subscribe(topic)
        print(f'Sensor {sensor_id} subscribed to topic {topic}')
        # You can save the subscriptions in a database or dictionary if needed
        # Example: self.subscriptions[sensor_id] = topic
