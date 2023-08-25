#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

// #include <ArduinoMqttClient.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class MQTTManager {
 private:
  AppConfig* appConfig;
  Managers* managers;

  WiFiClient wifiClient;
  PubSubClient mqttClient;

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
  void publishReadings(unsigned int readingRAW, unsigned long readingCM);

 private:
  // Static instance pointer for the callback function
  static MQTTManager* instance;  

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
  static void callbackFunction(char* topic, byte* payload, unsigned int length);
  void statusCallback(uint8_t* payload, unsigned int length);
  void configCallback(uint8_t* payload, unsigned int length);

  // Set mqqt connection info
  void setMqttConnectionInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H