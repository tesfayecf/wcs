from sensors.MQTT.manager import MqttManager

def connect():
    # Initialize the MQTT manager singleton
    mqqtManager = MqttManager()
    
    # Start broker connection 
    mqqtManager.start()

    # Set basic topics
    mqqtManager.config()