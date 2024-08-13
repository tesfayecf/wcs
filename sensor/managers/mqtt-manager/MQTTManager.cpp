#include "MQTTManager.h"

#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <TimeLib.h>
#include <ArduinoJson.h>

#include "../../app/AppConfig.h"
#include "../../misc/logger.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

MQTTManager::MQTTManager() : mqttClient(wifiClient) {}

void MQTTManager::init() {
    Logger::notice("MQTTManager::init", "MQTTManager Initialized");
}

void MQTTManager::setup() {
    Logger::notice("MQTTManager::setup", "MQTTManager start setup");

    // Set MQTT broker info
    // this->setBrokerInfo();

    // Set MQTT topics info
    this->setTopics();

    // Set MQTT connection info
    this->setConnectionInfo();

    // Set MQTT callback function
    mqttClient.setCallback(callbackFunction);

    // Connect to MQTT broker
    this->connect();

    // Subscribe to topics
    this->subscribeSensor();

    // Register sensor
    this->registerSensor();

    Logger::notice("MQTTManager::setup", "MQTTManager setup finished");
}

void MQTTManager::loop() {
    // Reconnect if disconnected
    if (!mqttClient.connected()) {
        Logger::warning("MQTTManager::loop", "MQTT disconnected, reconnecting...");
        reconnect();
    }

    // Update mqtt client connection
    this->mqttClient.loop();
}

void MQTTManager::publish(const MQTTMessage* messagePtr) {
    if (messagePtr == nullptr) {
        Logger::error("MQTTManager::publish", "Null pointer passed as message");
        return;
    }

    const MQTTMessage& message = *messagePtr;

    // Boundary check
    if (message.paramsCount > 5) {
        Logger::error("MQTTManager::publish", "paramsCount exceeds array boundary");
        return;
    }

    // Ensure params array is not null (optional)
    for (size_t i = 0; i < message.paramsCount; i++) {
        if (message.params[i] == nullptr) {
            Logger::error("MQTTManager::publish", "Null pointer found in params array");
            return;
        }
    }

    // Create main json object
    StaticJsonDocument<MQTT_MAX_PACKET_SIZE> jsonMessage;

    // Add action information
    JsonObject actionObject = jsonMessage.createNestedObject(MQTT_ACTION_KEY);
    actionObject[PARAM_TO_CHAR(MESSAGE_PARAMETERS::MESSAGE_TYPE)] = TYPE_TO_CHAR(message.type);
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

    // Publish message
    if (this->mqttClient.connected()) {
        this->mqttClient.publish(topic, jsonMessageStr.c_str());
        Logger::notice("MQTTManager::publish", "Message Published");
        Logger::verbose("MQTTManager::publish", "Message: " + jsonMessageStr);
        Logger::verbose("MQTTManager::publish", "Topic: " + String(topic));
        Logger::verbose("MQTTManager::publish", "Message type: " + String(TYPE_TO_CHAR(message.type)));
        Logger::verbose("MQTTManager::publish", "Action name: " + String(ACTION_TO_CHAR(message.action)));
    }
}

void MQTTManager::subscribe(const String& topic) {
    if (this->mqttClient.connected()) {
        this->mqttClient.subscribe(topic.c_str());
        Logger::notice("MQTTManager::subscribe", "Subscribed to topic: " + topic);
    }
    // TODO: Handle case when client is not connected
}


// Connection //
void MQTTManager::connect() {
    Logger::notice("MQTTManager::connect", "Connecting to MQTT broker");
    int r = 0;
    while (!mqttClient.connected()) {
        if (mqttClient.connect(this->appConfig->appInfo.sensorId.c_str())) {
            Logger::verbose("MQTTManager::connect", "Connected to MQTT broker");
            return;
        } else {
            delay(100);
            r++;
            if (r == 150) {
                Logger::error("MQTTManager::connect", "Failed to connect to MQTT broker");
                return;
            }
        }
    }
}

void MQTTManager::reconnect() {
    mqttClient.disconnect();
    this->connect();
}

// Callbacks //
void MQTTManager::callbackFunction(char *topic, byte *payload, unsigned int length) {
    Logger::notice("MQTTManager::callbackFunction", "Received MQTT message");
    Logger::verbose("MQTTManager::callbackFunction", "Topic: " + String(topic));
    Logger::verbose("MQTTManager::callbackFunction", "Payload: " + String((char*)payload));
    Logger::verbose("MQTTManager::callbackFunction", "Length: " + String(length));

    // Process message
    // MQTTMessage message;
}

// Actions //
void MQTTManager::subscribeSensor() {
    // Subscribe to command topic
    this->subscribe(this->commnadTopic);
}

void MQTTManager::registerSensor() {
    // Construct message
    Logger::verbose("MQTTManager::registerSensor", "Registering sensor");
    MQTTMessage message;
    message.type = MESSAGE_TYPES::REGISTER;
    message.action = MESSAGE_ACTIONS::REGISTER_SENSOR;
    message.params[0] = this->appConfig->appInfo.sensorId.c_str();
    message.paramsCount = 1;
    
    this->publish(&message);
}

// Setters //
void MQTTManager::setTopics() {
    // Publish MQTT topics
    this->registerTopic = String("server") + "/" + MQTT_REGISTER_TOPIC;
    this->dataTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
    // Subscribe MQTT topics
    this->commnadTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_COMMAND_TOPIC;

    Logger::verbose("MQTTManager::setTopics", "Topics set succesfully");
}

void MQTTManager::setConnectionInfo() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT);
    mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);

    Logger::verbose("MQTTManager::setConnectionInfo", "Connection info set succesfully");
}
