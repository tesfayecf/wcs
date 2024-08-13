#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../app/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../BaseManager.h"

class App;

class MQTTManager : public BaseManager {
  private:
    WiFiClient wifiClient;
    PubSubClient mqttClient;

    boolean connected;
    boolean connecting;
    String sensorId;

    String dataTopic;
    String commnadTopic;
    String registerTopic;
  
  public:
    MQTTManager();

    // Initialize manager
    void init() override;

    // Setup MQTT connection
    void setup() override;

    // Loop manager to check MQTT connection status
    void loop() override;

    // Publish message to MQTT topic
    void publish(const MQTTMessage* messagePtr);
    

    // Subscribe to MQTT topic
    void subscribe(const String& topic);

  private:
    // Connection //
    // Connect to MQTT broker
    void connect();

    // Reconnect to MQTT broker
    void reconnect();

    // Callbacks //
    // MQTT callback function
    static void callbackFunction(char* topic, byte* payload, unsigned int length);
    // void statusCallback(uint8_t* payload, unsigned int length);
    // void configCallback(uint8_t* payload, unsigned int length);
    // void authCallback(uint8_t* payload, unsigned int length);

    // Actions //
    // Subscribe to sensor command topic
    void subscribeSensor();

    // Register sensor with MQTT broker
    void registerSensor();

    // Setters //
    // Set MQTT topics and connection information
    void setConnectionInfo();
    void setTopics();
};

#endif  // MQTT_CONNECTION_MANAGER_H