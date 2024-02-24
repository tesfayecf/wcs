from sensors.MQTT.server import MqttServer

def connect():
    # Initialize the MQTT manager 
    mqttServer = MqttServer()
    
    # Start broker connection 
    mqttServer.start()

    # Set basic topics
    mqttServer.config()