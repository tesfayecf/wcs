#include "MQTTManager.h"

#include <ArduinoJson.h>
#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/App/App.h"
#include "../../utils/constants.h"
#include "MQTTManager.h"

MQTTManager::MQTTManager(App& app) : appInstance(app), mqttClient(wifiClient) {}

void MQTTManager::setup() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    // mqttClient.setCallback(
    //     [this](char* topic, uint8_t* payload, unsigned int length) {
    //         this->onMessageReceived(topic, payload, length);
    //     });

    connectMQTT();
    // TODO: subscribe to server topics: sensorID/status, sensorID/timer, ...
}

void MQTTManager::loop() {
    if (!mqttClient.connected()) {
        reconnect();
    }

    mqttClient.loop();
}

void MQTTManager::connectMQTT() {
    String clientId_64 = this->getSensorID();
    while (!mqttClient.connected()) {
        if (mqttClient.connect(clientId_64.c_str())) {
            Serial.println("MQTT connected");
            return;
        } else {
            delay(1000);
        }
    }
}

void MQTTManager::reconnect() {
    mqttClient.disconnect();
    connectMQTT();
}

void MQTTManager::onMessageReceived(char* topic, byte* payload,
                                    unsigned int length) {
    // Handle received MQTT messages here. Used to check status from server and
    // sync timers
}

void MQTTManager::subscribe(const char* topic) {
    if (mqttClient.connected()) {
        mqttClient.subscribe(topic);
    }
}

void MQTTManager::publishReadings(unsigned int readingRAW, float readingCM) {
    StaticJsonDocument<200> jsonDoc;
    JsonObject jsonObj = jsonDoc.to<JsonObject>();
    // Add message data
    jsonObj["readingRAW"] = readingRAW;
    jsonObj["readingCM"] = readingCM;

    char topic[50];
    sprintf(topic, "%s/reading", this->getSensorID().c_str());

    this->basePublish(jsonObj, topic);
}

void MQTTManager::basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                              const char* topic) {
    // Add sensor metadata
    this->addMetadata(dataObject);
    // Get max size of websocket message
    char websocketMessageChar[200];
    // Serialize message
    serializeJson(dataObject, websocketMessageChar, 200);
    // Publish message
    mqttClient.publish(topic, websocketMessageChar);

    Serial.println(topic);
    Serial.println(websocketMessageChar);
}

void MQTTManager::addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject) {
    dataObject["sensorID"] = this->getSensorID();
    dataObject["sensorTime"] = millis() / 1000;
    // dataObject["serverTime"] = this->appInstance.serverTime;

    // dataObject["sensorType"] = this->appInstance.sensorType;
    // dataObject["sensorName"] = this->appInstance.sensorName;
}

String MQTTManager::getSensorID() {
    // Get device mac from WiFi
    // byte mac[6];
    // WiFi.macAddress(mac);
    // String sensorID = "";
    // for (int i = 0; i < 6; i++) {
    //     sensorID += String(mac[i], 16);
    //     if (i < 5) {
    //         sensorID += ":";
    //         continue;
    //     }
    // }

    // // convert to base 64 string
    // int inputStringLength = sensorID.length();
    // int encodedLength = Base64.encodedLength(inputStringLength);
    // char sensorID_64[encodedLength + 1];
    // Base64.encode(sensorID_64, sensorID, inputStringLength);
    // return String(sensorID_64);
    String sensorID = "RTg6OUY6NkQ6OTM6NTk6QjM=";
    return sensorID;
}
