#include "MQTTConnectionManager.h"

#include <ESP8266WiFi.h>

#include "../../utils/constants.h"

MQTTConnectionManager::MQTTConnectionManager() : mqttClient(wifiClient) {}

void MQTTConnectionManager::init() {
    // mqttClient.setId("clientId");
    // mqttClient.setUsernamePassword("username", "password");

    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    // mqttClient.setCallback(
    //     [this](char* topic, byte* payload, unsigned int length) {
    //         this->onMessageReceived(topic, payload, length);
    //     });

    connectMQTT();
}

void MQTTConnectionManager::loop() {
    // if (!mqttClient.connected()) {
    //     reconnect();
    // }

    mqttClient.loop();
}

void MQTTConnectionManager::connectMQTT() {
    while (!mqttClient.connected()) {
        if (mqttClient.connect("userID")) {
            return;
        } else {
            delay(1000);
        }
    }
}

void MQTTConnectionManager::reconnect() {
    // mqttClient.disconnect();
    // connectMQTT();
}

void MQTTConnectionManager::onMessageReceived(char* topic, byte* payload,
                                              unsigned int length) {
    // Handle received MQTT messages here, if needed
    // Serial.print("Topic: ");
    // Serial.println(topic);
    // Serial.print("Message: ");
    // for (int i = 0; i < length; i++) {
    //     Serial.print((char)payload[i]);
    //     if (payload[i] == '\n') {
    //         Serial.print("\n");
    //         break;
    //     }
    // }
}

void MQTTConnectionManager::subscribe(const char* topic) {
    // if (mqttClient.connected()) {
    //     mqttClient.subscribe(topic);
    //     Serial.println("Subscribed to: " + String(topic));
    // }
}

void MQTTConnectionManager::publish(char* message, const char* topic) {
    if (mqttClient.connected()) {
        Serial.println("Published message: " + String(message));
        mqttClient.publish(topic, message);
        //     Serial.println("Published message: " + String(message));
    }
}
