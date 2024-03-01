#include "MQTTManager.h"

#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <TimeLib.h>
#include <ArduinoJson.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

#include "CustomJsonDocument.h"

// Singleton instance
MQTTManager *MQTTManager::instance = nullptr;

/// CONSTRUCTOR ///
MQTTManager::MQTTManager() : mqttClient(wifiClient) {
    Serial.println("MQTTManager constructor");
    instance = this;
}

/// INIT ///
void MQTTManager::init(App* app_, AppConfig* config_) {
    Serial.println("MQTTManager init");
    app = app_;
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
void MQTTManager::publish(const char* topic, const char* message) {
    if (this->mqttClient.connected()) {
        this->mqttClient.publish(topic, message);
    }
    // TODO: Handle case when client is not connected
}

void MQTTManager::test() {
    // Create test message

    MQTTMessage message;
    message.type = MESSAGE_TYPES::DATA;
    message.action = MESSAGE_ACTIONS::SENSOR_DATA;
    message.params[0] = "test";
    message.paramsCount = 1;

    this->publishMessage(&message);

    Serial.println("Publishing test message");
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
    Serial.print("Subscribe to command topic: ");
    Serial.println(this->commnadTopic);
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
    
    this->publishMessage(&message);
}

// Base methods
void MQTTManager::publishMessage(const MQTTMessage* messagePtr) {
    if (messagePtr == nullptr) {
        // Handle null pointer error
        return;
    }

    const MQTTMessage& message = *messagePtr;

    // Boundary check
    if (message.paramsCount > 5) {
        Serial.println("Error: paramsCount exceeds array boundary");
        return;
    }

    // Ensure params array is not null (optional)
    for (size_t i = 0; i < message.paramsCount; i++) {
        if (message.params[i] == nullptr) {
            Serial.println("Error: Null pointer found in params array");
            return;
        }
    }

    // Create main json object
    StaticJsonDocument<1024> jsonMessage;

    // Add action information
    JsonObject actionObject = jsonMessage.createNestedObject(MQTT_ACTION_KEY);
    actionObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::ACTION_TYPE)] = TYPE_TO_CHAR(message.type);
    actionObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::ACTION_NAME)] = ACTION_TO_CHAR(message.action);
    // Add message body
    for (size_t i = 0; i < message.paramsCount; i++) {
        char paramName[5]; // Assuming the maximum length of parameter name is 5
        snprintf(paramName, sizeof(paramName), "p%zu", i);
        actionObject[paramName] = message.params[i];
    }

    // Add sensor metadata
    JsonObject metaObject = jsonMessage.createNestedObject(MQTT_META_KEY);
    metaObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::MESSAGE_ID)] = generateRandomString(25);
    metaObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::TIMESTAMP)] = now();
    metaObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::SENSOR_TIME)] = millis();
    metaObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::VERSION)] = APP_VERSION;
    metaObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::SENSOR_ID)] = this->appConfig->appInfo.sensorId.c_str();

    // Serialize JSON to a string
    String jsonMessageStr;
    serializeJson(jsonMessage, jsonMessageStr);

    // Choose topic based on message type
    const char* topic;
    switch (message.type) {
        case MESSAGE_TYPES::REGISTER:
            topic = this->registerTopic.c_str();
            break;
        case MESSAGE_TYPES::DATA:
            topic = this->dataTopic.c_str();
            break;
        case MESSAGE_TYPES::COMMAND:
            topic = this->commnadTopic.c_str();
            break;
        default:
            topic = "default";
            break;
    }

    Serial.print("Publish message: ");
    Serial.print(topic);
    Serial.print(" | ");
    Serial.println(jsonMessageStr);

    // Publish message
    this->publish(topic, jsonMessageStr.c_str());
}


// Setters
void MQTTManager::setMQTTInfo() {
    this->sensorId = this->appConfig->appInfo.sensorId;
    // Publish MQTT topics
    this->registerTopic = MQTT_REGISTER_TOPIC;
    this->dataTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
    // Subscribe MQTT topics
    this->commnadTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_COMMAND_TOPIC;
}

void MQTTManager::setMQTTConnectionInfo() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
    mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
