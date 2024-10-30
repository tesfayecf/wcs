#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../app/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"

#include "../BaseManager.h"

#include "./message.h"

class App;

class MQTTManager : public BaseManager {
private:
    WiFiClient wifiClient;
    PubSubClient mqttClient;

    MQTTConnectionState state;
    boolean connected;
    String sensorId;

    String dataTopic;
    String commandTopic;
    String registerTopic;
  
public:
    // Constructor
    MQTTManager();

    // Initialize manager
    void init() override;

    // Setup MQTT connection
    void setup() override;

    // Loop manager to check MQTT connection status
    void loop() override;

    
    // Publish message to MQTT topic
    void publish(const Message* messagePtr);
    
    // Subscribe to MQTT topic
    void subscribe(const String& topic);

    // Getters //
    MetaInfo getMetaInfo();

private:
    // Connect to MQTT broker
    boolean connect();

    // Reconnect to MQTT broker
    boolean reconnect();

    // Callbacks //
    static void callbackFunction(char* topic, byte* payload, unsigned int length);
    // void statusCallback(uint8_t* payload, unsigned int length);
    // void configCallback(uint8_t* payload, unsigned int length);
    // void authCallback(uint8_t* payload, unsigned int length);

    // Subscribe to sensor command topic
    void subscribeSensor();

    // Register sensor with MQTT broker
    void registerSensor();

    // Setters //
    void setConnectionInfo();
    void setTopics();


};

#endif  // MQTT_CONNECTION_MANAGER_H