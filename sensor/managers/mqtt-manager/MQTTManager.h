#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class MQTTManager {
 private:
  AppConfig* appConfig;
  Managers* managers;

  WiFiClient wifiClient;
  PubSubClient mqttClient;

  unsigned int distanceCM;
  unsigned int distanceRAW;

 public:
  /// CONSTRUCTOR ///
  MQTTManager();

  /// INIT ///
  void init(AppConfig* config_, Managers* managers_);

  /// SETUP ///
  void setup();

  /// LOOP ///
  void loop();

 private:
  static MQTTManager* instance;

  // Base methods
  void subscribe();
  void publish(ArduinoJson::V6213PB2::JsonObject& dataObject, const char* topic, bool meta = true);
  void addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject);

  // Actions
  void registerClient();
  void authenticateClient();
  void publishReadings(unsigned int readingRAW, unsigned int readingCM);

  // Connection
  void connect();
  void reconnect();

  // Callbacks
  static void callbackFunction(char* topic, byte* payload, unsigned int length);
  void statusCallback(uint8_t* payload, unsigned int length);
  void configCallback(uint8_t* payload, unsigned int length);
  void authCallback(uint8_t* payload, unsigned int length);

  // Setters
  void setMqttBasicInfo();
  void setMqttConnectionInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H