#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

// #include <ArduinoMqttClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

class App;  // Forward declaration of App

class MQTTConnectionManager {
   private:
    WiFiClient wifiClient;
    PubSubClient mqttClient;

    App& appInstance;

   public:
    // Constructor
    MQTTConnectionManager(App& app);

    // Initialize MQTT connection
    void init();

    // Main loop to handle MQTT events
    void loop();

    // Subscribe to an MQTT topic
    void subscribe(const char* topic);

    // Publish an MQTT message
    void publish(char* message, const char* topic);

   private:
    // Connect to the MQTT broker
    void connectMQTT();

    // Reconnect to the MQTT broker
    void reconnect();

    // Callback function for handling received MQTT messages
    void onMessageReceived(char* topic, byte* payload, unsigned int length);
};

#include "MQTTConnectionManager.cpp"
#endif  // MQTT_CONNECTION_MANAGER_H
