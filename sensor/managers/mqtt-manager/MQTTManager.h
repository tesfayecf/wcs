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

  void test();
 
 private:
  /// PUBLISH ///
  void publish(const char* topic, const char* message);

  /// SUBSCRIBE ///
  void subscribe(const String& topic);
 
 public:
  // Base methods
  void publishMessage(const MQTTMessage* messagePtr);

 private:
  static MQTTManager* instance;

  // Connection
  void connect();
  void reconnect();

  // Callbacks
  static void callbackFunction(char* topic, byte* payload, unsigned int length);
  // void statusCallback(uint8_t* payload, unsigned int length);
  // void configCallback(uint8_t* payload, unsigned int length);
  // void authCallback(uint8_t* payload, unsigned int length);

  // Actions
  void subscribeSensor();
  void registerSensor();

  // Setters
  void setMQTTConnectionInfo();
  void setMQTTInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H