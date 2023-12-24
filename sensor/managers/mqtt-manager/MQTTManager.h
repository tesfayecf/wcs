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

 public:
  /// CONSTRUCTOR ///
  MQTTManager();

  /// INIT ///72
  void init(AppConfig* config_, Managers* managers_);

  /// SETUP ///
  void setup();

  /// LOOP ///
  void loop();

  /// PUBLISH ///
  void publish(const char* action, MESSAGE_TYPES message_type, const char* params[], size_t paramsCount);

 private:
  static MQTTManager* instance;

  // Connection
  void connect();
  void reconnect();


  // Callbacks
  static void callbackFunction(char* topic, byte* payload, unsigned int length);
  void statusCallback(uint8_t* payload, unsigned int length);
  void configCallback(uint8_t* payload, unsigned int length);
  void authCallback(uint8_t* payload, unsigned int length);


  // Actions
  void registerClient();


  // Base methods
  void subscribe();
  void publish_(ArduinoJson::V6213PB2::StaticJsonDocument<1024> &message, MESSAGE_TYPES message_type, const char *topic);
  void addMetadata(ArduinoJson::V6213PB2::StaticJsonDocument<1024> &message);


  // Setters
  void setMqttConnectionInfo();
  void setMqttBasicInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H