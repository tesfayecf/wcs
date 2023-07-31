#include "MQTTConnectionManager.h"

#include <ESP8266WiFi.h>

#include "../../utils/constants.h"

MQTTConnectionManager::MQTTConnectionManager() : wifiClient(wifiClient) {}

void MQTTConnectionManager::init() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setCallback(
        [this](char* topic, byte* payload, unsigned int length) {
            this->onMessageReceived(topic, payload, length);
        });

    connect();
}

void MQTTConnectionManager::loop() {
    if (!mqttClient.connected()) {
        reconnect();
    }

    mqttClient.loop();
}

void MQTTConnectionManager::connect() {
    while (!mqttClient.connected()) {
        if (mqttClient.connect(MQTT_CLIENT_ID)) {
            return;
        } else {
            delay(1000);
        }
    }
}

void MQTTConnectionManager::reconnect() {
    mqttClient.disconnect();
    connect();
}

void MQTTConnectionManager::onMessageReceived(char* topic, byte* payload,
                                              unsigned int length) {
    // Handle received MQTT messages here, if needed
    Serial.print("Topic: ");
    Serial.println(topic);
    Serial.print("Message: ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
        if (payload[i] == '\n') {
            Serial.print("\n");
            break;
        }
    }
}

void MQTTConnectionManager::subscribe(const char* topic) {
    if (mqttClient.connected()) {
        mqttClient.subscribe(topic);
        Serial.println("Subscribed to: " + String(topic));
    }
}

void MQTTConnectionManager::publish(const char* message, const char* topic) {
    if (mqttClient.connected()) {
        mqttClient.publish(topic, message);
        Serial.println("Published message: " + String(message));
    }
}
