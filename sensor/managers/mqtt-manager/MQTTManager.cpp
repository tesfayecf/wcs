#include "MQTTManager.h"

#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <TimeLib.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

#include "JsonBuilder.h"

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

    // Set MQTT topics info
    this->setMQTTInfo();

    // Set MQTT connection info
    this->setMQTTConnectionInfo();

    // Set MQTT callback function
    // mqttClient.setCallback(callbackFunction);

    // Connect to MQTT broker
    this->connect();

    // Subscribe to topics
    this->subscribe();

    // Register client
    this->registerSensor();

    Serial.println("MQTTManager Initialized");
}

/// LOOP ///
void MQTTManager::loop() {
    // Reconnect if disconnected
    // if (!mqttClient.connected()) {
    //     reconnect();
    // }

    // Update mqtt client connection
    mqttClient.loop();
}

// Connection
void MQTTManager::connect() {
    Serial.print("Connecting to MQTT broker: ");
    while (!mqttClient.connected()) {
        if (mqttClient.connect(this->sensorId.c_str())) {
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

///////////////////////////////////////////////////////
// Actions
void MQTTManager::registerSensor() {
    // Construct message
    Serial.println("Registering sensor");
    MQTTMessage message;
    message.type = MESSAGE_TYPES::REGISTER;
    message.action = MESSAGE_ACTIONS::REGISTER_SENSOR;
    message.params[0] = this->sensorId.c_str();
    message.paramsCount = 1;
    
    this->publish_(message, MESSAGE_TYPES::COMMAND);
}

// Base methods
void MQTTManager::subscribe() {
    if (mqttClient.connected()) {
        // Config topic
        mqttClient.subscribe(this->commnadTopic.c_str());
        Serial.print("Subscribed to command topic");
    }
}

void MQTTManager::publish_(const MQTTMessage& message, MESSAGE_TYPES message_type) {
    // Create json object
    // StaticJsonDocument<512> jsonMessage;
    JsonBuilder jsonMessage;

    // JsonObject actionObject = jsonMessage.createNestedObject("action");
    JsonBuilder actionObject;

    // Add action name
    // actionObject[ETS(ACTION_NAME)] = message.action;
    actionObject.add(ETS(ACTION_NAME), message.action);

    // Add message data
    for (size_t i = 0; i < message.paramsCount; i++) {
        char paramName[4]; // Assuming the maximum length of parameter name is 3 ("p" + one digit)
        snprintf(paramName, sizeof(paramName), "p%zu", i);
        // actionObject[paramName] = message.params[i];
        actionObject.add(paramName, message.params[i]);
    }

    // Add sensor metadata
    // JsonObject metaObject = jsonMessage.createNestedObject("meta");
    JsonBuilder metaObject;
    
    // metaObject[ETS(MESSAGE_ID)] = "message_id";
    // metaObject[ETS(SENSOR_TIME)] = millis();
    // metaObject[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
    metaObject.add(ETS(MESSAGE_ID), "message_id");
    char sensorTime[16];
    snprintf(sensorTime, sizeof(sensorTime), "%lu", millis()); // Convert millis() to const char*
    metaObject.add(ETS(SENSOR_TIME), sensorTime);
    metaObject.add(ETS(SENSOR_ID), this->sensorId.c_str());

    jsonMessage.addObject("action", actionObject);
    jsonMessage.addObject("meta", metaObject);

    // Get max size of websocket message
    // char jsonMessageBuffer[512];
    // Serialize message
    // serializeJson(jsonMessage, jsonMessageBuffer, 512);
    
    String jsonMessageStr = jsonMessage.getString();
    
    // Publish message
    mqttClient.publish(this->appConfig->mqttManager.dataTopic.c_str(), jsonMessageStr.c_str());

    Serial.print("Published message: ");
    Serial.println(jsonMessageStr);
}

void MQTTManager::addMetadata(ArduinoJson::V6213PB2::StaticJsonDocument<512> &message) {
    // Create metadata object
    JsonObject metaObject = message.createNestedObject("meta");
    
    metaObject[ETS(MESSAGE_ID)] = "message_id";
    metaObject[ETS(TIMESTAMP)] = now();
    metaObject[ETS(SENSOR_ID)] = this->sensorId;
    // metaObject[ETS(SENSOR_TIME)] = millis();
    // metaObject[ETS(MESSAGE_TYPE)] = "message_type";
    // metaObject[ETS(VERSION)] = APP_VERSION;
    // metaObject[ETS(SENSOR_KEY)] = MQTT_SENSOR_KEY;
}
///////////////////////////////////////////////////////


// Setters
void MQTTManager::setMQTTInfo() {
    this->sensorId = this->appConfig->appInfo.sensorId;
    // Publish MQTT topics
    this->dataTopic = this->appConfig->appInfo.sensorId + this->appConfig->mqttManager.dataTopic;
    this->registerTopic = this->appConfig->mqttManager.registerTopic;
    // Subscribe MQTT topics
    this->commnadTopic = this->appConfig->appInfo.sensorId + this->appConfig->mqttManager.commandTopic;
}

void MQTTManager::setMQTTConnectionInfo() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
    mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
