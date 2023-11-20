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

    // Authenticate client
    this->authenticateClient();

    Serial.println("MQTTManager Initialized");
}

/// LOOP ///
void MQTTManager::loop() {
    // Reconnect if disconnected
    if (!mqttClient.connected()) {
        reconnect();
    }

    // Publish sensor data every 60 seconds
    if (millis() % MQTT_UPDATE_INTERVAL == 0) {
        // Read sensor data
        this->managers->hwManager->readSensorValues(this->distanceRAW, this->distanceCM);

        // Publish sensor data
        this->publishReadings(this->distanceRAW, this->distanceCM);
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

    if (strcmp(topic, instance->appConfig->mqttManager.statusTopic.c_str()) == 0) {
        instance->statusCallback(payload, length);
    } else if (strcmp(topic, instance->appConfig->mqttManager.configTopic.c_str()) == 0) {
        instance->configCallback(payload, length);
    } else if (strcmp(topic, instance->appConfig->mqttManager.authTopic.c_str()) == 0) {
        instance->authCallback(payload, length);
    }
}

void MQTTManager::authCallback(uint8_t *payload, unsigned int length) {
    Serial.println("Received auth message");
}

void MQTTManager::statusCallback(uint8_t *payload, unsigned int length) {
    Serial.println("Received status message");
    // create a json with the most relevant app info from the app config
    // and the payload
    StaticJsonDocument<1024> jsonDoc;
    JsonObject jsonObj = jsonDoc.to<JsonObject>();

    JsonObject wifiObj = jsonObj.createNestedObject("wifi");
    wifiObj[ETS(WIFI_INITIALIZED)] = this->appConfig->wifiManager.status.initialized;
    wifiObj[ETS(WIFI_CONNECTED_)] = this->appConfig->wifiManager.status.connected;
    wifiObj[ETS(WIFI_CONNECTING)] = this->appConfig->wifiManager.status.connecting;
    wifiObj[ETS(WIFI_DISCONNECTING)] = this->appConfig->wifiManager.status.disconnecting;
    wifiObj[ETS(WIFI_HAS_ERROR)] = this->appConfig->wifiManager.status.hasError;
    wifiObj[ETS(WIFI_ERROR)] = this->appConfig->wifiManager.status.error;
    wifiObj[ETS(WIFI_STATUS)] = this->appConfig->wifiManager.status.status;

    JsonObject mqttObj = jsonObj.createNestedObject("mqtt");
    mqttObj[ETS(MQTT_INITIALIZED)] = this->appConfig->mqttManager.status.initialized;
    mqttObj[ETS(MQTT_CONNECTED_)] = this->appConfig->mqttManager.status.connected;
    mqttObj[ETS(MQTT_CONNECTING)] = this->appConfig->mqttManager.status.connecting;
    mqttObj[ETS(MQTT_DISCONNECTING)] = this->appConfig->mqttManager.status.disconnecting;
    mqttObj[ETS(MQTT_HAS_ERROR)] = this->appConfig->mqttManager.status.hasError;
    mqttObj[ETS(MQTT_ERROR)] = this->appConfig->mqttManager.status.error;
    mqttObj[ETS(MQTT_STATUS)] = this->appConfig->mqttManager.status.status;

    JsonObject hwObj = jsonObj.createNestedObject("hw");
    hwObj[ETS(HW_INITIALIZED)] = this->appConfig->hardwareManager.status.initialized;
    hwObj[ETS(HW_CONNECTED)] = this->appConfig->hardwareManager.status.connected;
    hwObj[ETS(HW_CONNECTING)] = this->appConfig->hardwareManager.status.connecting;
    hwObj[ETS(HW_DISCONNECTING)] = this->appConfig->hardwareManager.status.disconnecting;
    hwObj[ETS(HW_HAS_ERROR)] = this->appConfig->hardwareManager.status.hasError;
    hwObj[ETS(HW_ERROR)] = this->appConfig->hardwareManager.status.error;
    hwObj[ETS(HW_STATUS)] = this->appConfig->hardwareManager.status.status;

    this->publish(jsonObj, this->appConfig->mqttManager.statusTopic.c_str());
}

void MQTTManager::configCallback(uint8_t *payload, unsigned int length) {
    Serial.println("Received config message");
    this->appConfig->appInfo.registered = true;
}


// Actions
void MQTTManager::registerClient() {
    // Creat json object
    StaticJsonDocument<512> registerDoc;
    JsonObject registerObj = registerDoc.to<JsonObject>();
    // Add message data
    registerObj[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
    confirmObj[ETS(MESSAGE)] = MESSAGE_TYPES.REGISTER;
    this->publish(registerObj, this->appConfig->mqttManager.registerTopic.c_str(), false);

    unsigned long registrationTimeout = millis() + 10000; // 10 seconds timeout

    while (millis() < registrationTimeout) {
        mqttClient.loop(); // Process incoming messages

        // Handle the registration
        if (this->appConfig->appInfo.registered) {

            // Creat json object
            StaticJsonDocument<512> confirmDoc;
            JsonObject confirmObj = confirmDoc.to<JsonObject>();
            // Add message data
            confirmObj[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
            confirmObj[ETS(MESSAGE)] = MESSAGE_TYPES.OK;


            Serial.println("Registration completed!");
            return;
        }

        delay(100); // Add a short delay to avoid busy-waiting
    }

    // Creat json object
    StaticJsonDocument<512> refuseDoc;
    JsonObject refuseObj = refuseDoc.to<JsonObject>();
    // Add message data
    refuseObj[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
    refuseObj[ETS(MESSAGE)] = MESSAGE_TYPES.NOK;

    Serial.println("Registration timed out!");
}

void MQTTManager::authenticateClient() {
    Serial.println("Authenticating client");
    this->appConfig->appInfo.authenticated = true;
}

void MQTTManager::publishReadings(unsigned int readingRAW, unsigned int readingCM) {
    StaticJsonDocument<512> jsonDoc;
    JsonObject jsonObj = jsonDoc.to<JsonObject>();
    // Add message data
    jsonObj[ETS(READING_RAW)] = readingRAW;
    jsonObj[ETS(READING_CM)] = readingCM;

    this->publish(jsonObj, this->appConfig->mqttManager.dataTopic.c_str(), true);
}


// Base methods
void MQTTManager::subscribe() {
    if (mqttClient.connected()) {
        // Config topic
        mqttClient.subscribe(this->appConfig->mqttManager.configTopic.c_str());
        Serial.print("Subscribed to topic: ");
        Serial.println(this->appConfig->mqttManager.configTopic.c_str());
        // Auth topic
        mqttClient.subscribe(this->appConfig->mqttManager.authTopic.c_str());
        Serial.print("Subscribed to topic: ");
        Serial.println(this->appConfig->mqttManager.authTopic.c_str());
    }
}

void MQTTManager::publish(ArduinoJson::V6213PB2::JsonObject &dataObject, const char *topic, bool meta) {
    // Add sensor metadata
    if (meta) {
        JsonObject metaObj = dataObject.createNestedObject("meta");
        this->addMetadata(metaObj);
    }

    // Get max size of websocket message
    char websocketMessageChar[1024];
    // Serialize message
    serializeJson(dataObject, websocketMessageChar, 1024);
    // Publish message
    mqttClient.publish(topic, websocketMessageChar);

    Serial.print("Published message: ");
    Serial.println(websocketMessageChar);
}

void MQTTManager::addMetadata(JsonObject &metaObj) {
    metaObj[ETS(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
    metaObj[ETS(SENSOR_TIME)] = millis();
    metaObj[ETS(TIMESTAMP)] = now();
}


// Setters
void MQTTManager::setMqttBasicInfo() {
    // Send MQTT topics
    this->appConfig->mqttManager.dataTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
    this->appConfig->mqttManager.statusTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_STATUS_TOPIC;

    // Receive MQTT topics
    this->appConfig->mqttManager.configTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_CONFIG_TOPIC;
    this->appConfig->mqttManager.authTopic = this->appConfig->appInfo.sensorId + "/" + MQTT_AUTH_TOPIC;
    this->appConfig->mqttManager.registerTopic = MQTT_REGISTER_TOPIC;
}

void MQTTManager::setMqttConnectionInfo() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
    mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
    mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
