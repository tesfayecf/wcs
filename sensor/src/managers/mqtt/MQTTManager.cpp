#include "MQTTManager.h"

#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <TimeLib.h>
#include <ArduinoJson.h>

#include "../../app/App.h"
#include "../../app/AppConfig.h"
#include "../../misc/logger.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

#include "./Message.h"

MQTTManager::MQTTManager() : mqttClient(wifiClient), state(MQTTConnectionState::DISCONNECTED) {}

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


void MQTTManager::publish(const Message* messagePtr) {
    if (messagePtr == nullptr) {
        Logger::error("MQTTManager::publish", "Null pointer passed as message");
        return;
    }

    const Message& message = *messagePtr;

    // Boundary check
    if (message.payload_count > 5) {
        Logger::error("MQTTManager::publish", "paramsCount exceeds array boundary");
        return;
    }

    // Ensure params array is not null (optional)
    for (size_t i = 0; i < message.payload_count; i++) {
        if (message.payload[i] == nullptr) {
            Logger::error("MQTTManager::publish", "Null pointer found in params array");
            return;
        }
    }

    // Serialize JSON to a string
    String jsonMessageStr;
    message.toJsonManual(jsonMessageStr);

    // Encode message to base64
    String base64Message = base64Encode(jsonMessageStr);

    // Choose topic based on message type
    const char* topic;
    switch (message.action_type) {
        case ActionType::Register:
            topic = this->registerTopic.c_str();
            break;
        case ActionType::Data:
            topic = this->dataTopic.c_str();
            break;
        case ActionType::Command:
            topic = this->commandTopic.c_str();
            break;
        default:
            topic = "-";
            break;
    }

    // Publish message
    if (this->mqttClient.connected()) {
        this->mqttClient.publish(topic, base64Message.c_str());
        Logger::notice("MQTTManager::publish", "Message Published");
        Logger::verbose("MQTTManager::publish", "Message: " + base64Message);
        Logger::verbose("MQTTManager::publish", "Topic: " + String(topic));
        // Logger::verbose("MQTTManager::publish", "Message type: " + String(TYPE_TO_CHAR(message.type)));
        // Logger::verbose("MQTTManager::publish", "Action name: " + String(ACTION_TO_CHAR(message.action)));
    }

    delete messagePtr;
}

void MQTTManager::subscribe(const String& topic) {
    if (this->mqttClient.connected()) {
        this->mqttClient.subscribe(topic.c_str());
        Logger::notice("MQTTManager::subscribe", "Subscribed to topic: " + topic);
    }
    // TODO: Handle case when client is not connected
}

// Connection //
boolean MQTTManager::connect() {
    Logger::notice("MQTTManager::connect", "Connecting to MQTT broker");
    this->connected = false;

    int retryCount = 0;
    int retryDelay = 100; // ms

    while (retryCount < MAX_RETRY_ATTEMPTS) {
        if (this->mqttClient.connect(this->appConfig->appInfo.sensorId.c_str())) {
            this->connected = true;
            return true;
        }

        Logger::warning("MQTTManager::connect()", "Connection attempt failed. Retrying...");
        delay(retryDelay);
        retryCount++;
        retryDelay *= 2; // Exponential backoff
    }

    Logger::error("WifiManager::connect()", "Failed to connect after maximum attempts");
    return false;
}

boolean MQTTManager::reconnect() {
    this->mqttClient.disconnect();
    return this->connect();
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
    this->subscribe(this->commandTopic);
}

void MQTTManager::registerSensor() {
    // Construct message
    Logger::verbose("MQTTManager::registerSensor", "Registering sensor");

    // Fill payload array
    String payload[5];
    payload[0] = this->appConfig->appInfo.sensorId;

    // Create message object
    Message* message = new Message(ActionType::Register, RegisterAction::Sensor, payload, 1, this->getMetaInfo());
    
    // Publish message
    // this->publish(message);
}

// Setters //
void MQTTManager::setTopics() {
    // Publish MQTT topics
    this->registerTopic = String("server") + "/" + MQTT_REGISTER_TOPIC;
    this->dataTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
    // Subscribe MQTT topics
    this->commandTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_COMMAND_TOPIC;

    Logger::verbose("MQTTManager::setTopics", "Topics set succesfully");
}

void MQTTManager::setConnectionInfo() {
    this->mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    this->mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    this->mqttClient.setSocketTimeout(MQTT_SERVER_CONNECTION_TIMEOUT);
    this->mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);

    Logger::verbose("MQTTManager::setConnectionInfo", "Connection info set succesfully");
}

MetaInfo MQTTManager::getMetaInfo() {
    MetaInfo metaInfo;
    metaInfo.message_id = generateRandomString(24);
    // metaInfo.message_id = generateRandomString(24).c_str();
    metaInfo.timestamp = now();
    metaInfo.sensor_time = millis();
    metaInfo.version = String(APP_VERSION);
    // metaInfo.version = APP_VERSION;
    metaInfo.sensor_id = this->appConfig->appInfo.sensorId;
    // metaInfo.sensor_id = this->appConfig->appInfo.sensorId.c_str();
    
    // metaInfo.sensorType = this->appConfig->appInfo.sensorType.c_str();
    // metaInfo.sensorLocation = this->appConfig->appInfo.sensorLocation.c_str();
    return metaInfo;
}