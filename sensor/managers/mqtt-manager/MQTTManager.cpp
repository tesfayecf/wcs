#include "MQTTManager.h"

#include <ArduinoJson.h>
#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <TimeLib.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

// Singleton instance
MQTTManager *MQTTManager::instance = nullptr;

/// CONSTRUCTOR ///
MQTTManager::MQTTManager() : mqttClient(wifiClient) {
    Serial.println("MQTTManager constructor");
    instance = this;
}

/// INIT ///
void MQTTManager::init(AppConfig *config_, Managers *managers_) {
    Serial.println("MQTTManager init");
    managers = managers_;
    appConfig = config_;
}

/// SETUP ///
void MQTTManager::setup() {
    Serial.println("Initializing MQTTManager");

    // Set MQTT basic info
    this->setMqttBasicInfo();

    // Set MQTT connection info
    this->setMqttConnectionInfo();

    // Set MQTT callback function
    mqttClient.setCallback(callbackFunction);

    // Connect to MQTT broker
    this->connect();

    // Subscribe to topics
    this->subscribe();

    // Register client
    this->registerClient();

    Serial.println("MQTTManager Initialized");
}

/// LOOP ///
void MQTTManager::loop() {
    // Reconnect if disconnected
    if (!mqttClient.connected()) {
        reconnect();
    }

    // Update mqtt client connection
    mqttClient.loop();
}


// Connection
void MQTTManager::connect() {
    String clientId = this->appConfig->appInfo.sensorId;
    Serial.print("Connecting to MQTT broker: ");
    while (!mqttClient.connected()) {
        if (mqttClient.connect(clientId.c_str())) {
            Serial.println("MQTT connected");
            return;
        } else {
            Serial.print(".");
            delay(100);
        }
    }
    Serial.println("MQTT connection failed");
}

void MQTTManager::reconnect() {
    mqttClient.disconnect();
    this->connect();
}


// Callbacks
void MQTTManager::callbackFunction(char *topic, byte *payload, unsigned int length) {
    Serial.println("Received MQTT message");
    Serial.print("Topic: ");
    Serial.println(topic);
    Serial.print("Payload: ");
    Serial.write(payload, length);
    Serial.println();
    payload[length] = '\0'; // Add a null terminator to the payload

    // if (strcmp(topic, instance->appConfig->mqttManager.statusTopic.c_str()) == 0) {
    //     instance->statusCallback(payload, length);
    // } else if (strcmp(topic, instance->appConfig->mqttManager.configTopic.c_str()) == 0) {
    //     instance->configCallback(payload, length);
    // } else if (strcmp(topic, instance->appConfig->mqttManager.authTopic.c_str()) == 0) {
    //     instance->authCallback(payload, length);
    // }
}

// Actions
void MQTTManager::registerClient() {
    this->publish("register", MESSAGE_TYPES::COMMAND, new const char*[1]{this->appConfig->mqttManager.sensorKey.c_str()}, 1);
}

// Base methods
void MQTTManager::subscribe() {
    if (mqttClient.connected()) {
        // Config topic
        mqttClient.subscribe(this->appConfig->mqttManager.commandTopic.c_str());
        Serial.print("Subscribed to topic: ");
        Serial.println(this->appConfig->mqttManager.commandTopic.c_str());
    }
}

void MQTTManager::publish(const char* action, MESSAGE_TYPES message_type, const char* params[], size_t paramsCount) {
    // Create json object
    StaticJsonDocument<1024> message;
    JsonObject actionObject = message.createNestedObject("action");

    // Add action name
    actionObject[ETS(ACTION_NAME)] = action;

    // Add message data
    for (size_t i = 0; i < paramsCount; i++) {
        String paramName = "p" + String(i);
        actionObject[paramName.c_str()] = params[i];
    }

    this->publish_(message, message_type, this->appConfig->mqttManager.dataTopic.c_str());
}

void MQTTManager::publish_(ArduinoJson::V6213PB2::StaticJsonDocument<1024> &message, MESSAGE_TYPES message_type, const char *topic) {
    // Add sensor metadata
    this->addMetadata(message);

    // Get max size of websocket message
    char websocketMessageChar[1024];
    // Serialize message
    serializeJson(message, websocketMessageChar, 1024);
    // Publish message
    mqttClient.publish(topic, websocketMessageChar);

    Serial.print("Published message: ");
    Serial.println(websocketMessageChar);
}

void MQTTManager::addMetadata(ArduinoJson::V6213PB2::StaticJsonDocument<1024> &message) {
    // Create metadata object
    JsonObject metaObject = message.createNestedObject("meta");
    
    metaObject[ETS(MESSAGE_ID)] = "message_id";
    metaObject[ETS(TIMESTAMP)] = now();
    metaObject[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
    metaObject[ETS(SENSOR_TIME)] = millis();
    metaObject[ETS(MESSAGE_TYPE)] = "message_type";
    metaObject[ETS(VERSION)] = APP_VERSION;
    metaObject[ETS(SENOSOR_KEY)] = this->appConfig->mqttManager.sensorKey;
}


// Setters
void MQTTManager::setMqttBasicInfo() {
    // Publish MQTT topics
    this->appConfig->mqttManager.dataTopic = this->appConfig->appInfo.sensorId;
}

void MQTTManager::setMqttConnectionInfo() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
    mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
