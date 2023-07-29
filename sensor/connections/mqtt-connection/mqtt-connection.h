#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

#include <PubSubClient.h>
#include <WiFi.h>

class MQTTConnectionManager {
   private:
    WiFiClient wifiClient;
    PubSubClient mqttClient;

   public:
    // Constructor
    MQTTConnectionManager();

    // Initialize MQTT connection
    void init();

    // Main loop to handle MQTT events
    void loop();

    // Subscribe to an MQTT topic
    void subscribe(const char* topic);

    // Publish an MQTT message
    void publish(const char* message, const char* topic);

   private:
    // Connect to the MQTT broker
    void connect();

    // Reconnect to the MQTT broker
    void reconnect();

    // Callback function for handling received MQTT messages
    void onMessageReceived(char* topic, byte* payload, unsigned int length);
};

#endif  // MQTT_CONNECTION_MANAGER_H
