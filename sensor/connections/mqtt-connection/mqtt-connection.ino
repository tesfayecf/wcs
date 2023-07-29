#include <PubSubClient.h>
#include <WiFi.h>

// MQTT broker details
class MQTTConnectionManager {
   private:
    WiFiClient wifiClient;
    PubSubClient mqttClient;
    const char *clientId;
    const char *topic;  // The MQTT topic to subscribe to (if needed)

   public:
    MQTTConnectionManager(const char *clientId, const char *topic = nullptr)
        : mqttClient(wifiClient), clientId(clientId), topic(topic) {}

    void init() {
        mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
        mqttClient.setCallback(
            [this](char *topic, byte *payload, unsigned int length) {
                this->onMessageReceived(topic, payload, length);
            });

        connectToMQTT();
    }

    void loop() {
        if (!mqttClient.connected()) {
            reconnectToMQTT();
        }

        mqttClient.loop();
    }

    void publishMessage(const char *message) {
        if (mqttClient.connected()) {
            mqttClient.publish(topic, message);
        }
    }

   private:
    void connectToMQTT() {
        while (!mqttClient.connected()) {
            Serial.print("Attempting MQTT connection...");
            if (mqttClient.connect(clientId)) {
                Serial.println("connected to MQTT broker");
                if (topic) {
                    mqttClient.subscribe(topic);
                }
            } else {
                Serial.print("failed, rc=");
                Serial.print(mqttClient.state());
                Serial.println(" try again in 5 seconds");
                delay(5000);
            }
        }
    }

    void reconnectToMQTT() {
        mqttClient.disconnect();
        connectToMQTT();
    }

    void onMessageReceived(char *topic, byte *payload, unsigned int length) {
        // Handle received MQTT messages here, if needed
    }
};
