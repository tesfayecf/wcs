# mqtt_manager.py

import paho.mqtt.client as mqtt

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
        self.mqtt_client = mqtt.Client(client_id="server", clean_session=True)
        self.mqtt_client.user_data_set(userdata={'username': "server"})
        self.mqtt_client.on_message = self.on_message
        self.mqtt_client.connect(self.host, self.port)
        self.mqtt_client.loop_start()
        self._initialized = True

    def on_message(self, client, userdata, message):
        # Handle incoming MQTT messages here
        payload = message.payload.decode('utf-8')
        topic = message.topic
        print(f'Received message: {payload} on topic: {topic}')

    def subscribe(self, topic):
        self.mqtt_client.subscribe(topic)
        print(f'Subscribed to topic {topic}')
        # You can save the subscriptions in a database or dictionary if needed
        # Example: self.subscriptions[sensor_id] = topic

    def publish(self, data, topic):
        self.mqtt_client.publish(topic, data)
        print(f'Published data: {data} on topic: {topic}')
        # You can save the publications in a database or dictionary if needed
        # Example: self.publications[topic] = data