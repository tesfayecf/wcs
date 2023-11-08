from utils.mqttManager import MqttManager
import time

def connect():
    # Initialize the MQTT manager singleton
    mqqtManager = MqttManager()
    
    # Start broker connection (assuming it's an async method)
    mqqtManager.start()

    # Set basic topics (assuming it's an async method)
    mqqtManager.config()