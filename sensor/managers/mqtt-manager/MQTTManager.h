#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

// #include <ArduinoMqttClient.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
// #include "../../utils/types.h"
struct Managers;

class MQTTManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

    WiFiClient wifiClient;
    PubSubClient mqttClient;

    const String senosorId = WiFi.macAddress();

   public:
    // Constructor
    MQTTManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    // Setup MQTT connection
    void setup();

    // Main loop to handle MQTT events
    void loop();

    // Subscribe to an MQTT topic
    void subscribe(const char* topic);

    // Publish a sensor readings
    void publishReadings(unsigned int readingRAW, float readingCM);

   private:
    // Connect to the MQTT broker
    void connectMQTT();

    // Reconnect to the MQTT broker
    void reconnect();

    // Publish an MQTT message
    void basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                     const char* topic);

    // Add metadata to the MQTT message
    void addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject);

    // Callback function for handling received MQTT messages
    void onMessageReceived(char* topic, byte* payload, unsigned int length);

    // Get sensor ID from MAC address
    String getSensorID();
};

#endif  // MQTT_CONNECTION_MANAGER_H
