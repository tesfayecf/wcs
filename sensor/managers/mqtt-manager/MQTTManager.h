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

  boolean connected; // TODO: use manager status from appConfig
  boolean connecting; // TODO: use manager status from appConfig
  String sensorId;
  String dataTopic;
  String commnadTopic;
  String registerTopic;

 public:
  /// CONSTRUCTOR ///
  MQTTManager();

  /// INIT ///
  void init(AppConfig* config_, Managers* managers_);

  /// SETUP ///
  void setup();

  /// LOOP ///
  void loop();

  /// PUBLISH ///
  void publish_(const MQTTMessage& message, MESSAGE_TYPES message_type);

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
  void registerSensor();

  // Base methods
  void subscribe();
  void addMetadata(ArduinoJson::V6213PB2::StaticJsonDocument<512> &message);

  // Setters
  void setMQTTConnectionInfo();
  void setMQTTInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H