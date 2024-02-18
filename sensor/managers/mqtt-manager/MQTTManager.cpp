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

    // Subscribe to command topic
    this->subscribeSensor();

    // Register sensor
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
    this->mqttClient.loop();
}

/// PUBLISH ///
void MQTTManager::publish(const String& topic, const String& message) {
    if (this->mqttClient.connected()) {
        this->mqttClient.publish(topic.c_str(), message.c_str());
    }
    // TODO: Handle case when client is not connected
}

/// SUBSCRIBE ///   
void MQTTManager::subscribe(const String& topic) {
    if (this->mqttClient.connected()) {
        this->mqttClient.subscribe(topic.c_str());
    }
    // TODO: Handle case when client is not connected
}

// Server Connection
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

// Actions
void MQTTManager::subscribeSensor() {
    Serial.println("Subscribe to command topic");
    this->subscribe(this->commnadTopic);
}

void MQTTManager::registerSensor() {
    // Construct message
    Serial.println("Registering sensor");
    MQTTMessage message;
    message.type = MESSAGE_TYPES::REGISTER;
    message.action = MESSAGE_ACTIONS::REGISTER_SENSOR;
    message.params[0] = this->sensorId.c_str();
    message.paramsCount = 1;
    
    this->publishMessage(message);
}

// Base methods
void MQTTManager::publishMessage(const MQTTMessage& message) {
    // Create main json object
    JsonBuilder jsonMessage;

    // Add action infomation
    JsonBuilder actionObject;
    actionObject.add(MESSAGE_PARAMETERS::ACTION_TYPE, TYPE_TO_CHAR(message.type));
    actionObject.add(MESSAGE_PARAMETERS::ACTION_NAME, ACTION_TO_CHAR(message.action));
    // Add message body
    for (size_t i = 0; i < message.paramsCount; i++) {
        char paramName[4]; // Assuming the maximum length of parameter name is 3 ("p" + one digit)
        snprintf(paramName, sizeof(paramName), "p%zu", i);
        actionObject.add(paramName, message.params[i]);
    }

    // Add sensor metadata
    JsonBuilder metaObject;
    metaObject.add(MESSAGE_PARAMETERS::MESSAGE_ID, "message_id");
    char serverTime[16];
    snprintf(serverTime, sizeof(serverTime), "%lu", this->appConfig->appInfo.serverTime); // Convert millis() to const char*
    metaObject.add(MESSAGE_PARAMETERS::TIMESTAMP, serverTime);
    metaObject.add(MESSAGE_PARAMETERS::SENSOR_ID, this->sensorId.c_str());
    char localTime[16];
    snprintf(localTime, sizeof(localTime), "%lu", this->appConfig->appInfo.localTime); // Convert millis() to const char*
    metaObject.add(MESSAGE_PARAMETERS::SENSOR_TIME, localTime);
    metaObject.add(MESSAGE_PARAMETERS::VERSION, APP_VERSION);

    jsonMessage.addObject(MQTT_ACTION_KEY, actionObject);
    jsonMessage.addObject(MQTT_META_KEY, metaObject);
    
    String jsonMessageStr = jsonMessage.getString();

    Serial.print("Published message: ");
    Serial.println(jsonMessageStr);

    // Publish message
    this->publish(this->appConfig->mqttManager.dataTopic, jsonMessageStr);
}

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
