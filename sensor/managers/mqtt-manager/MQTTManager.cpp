#include "MQTTManager.h"

#include <ArduinoJson.h>
#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

// Singleton instance
MQTTManager* MQTTManager::instance = nullptr;

MQTTManager::MQTTManager() : mqttClient(wifiClient) {
  Serial.println("MQTTManager constructor");
  instance = this;
}

/// INIT ///
void MQTTManager::init(AppConfig* config_, Managers* managers_) {
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
  if (!mqttClient.connected()) {
    reconnect();
  }

  // Publish sensor data every 10 seconds
  if (millis() % 10000 == 0) {
    unsigned int distanceRaw;
    unsigned int distanceCM;

    // this->mqttClient.publish("test_", "testData");

    // Read data
    this->managers->hwManager->readSensorValues(distanceRaw, distanceCM);

    // Publish data
    this->publishReadings(distanceRaw, distanceCM);
  }

  mqttClient.loop();
}

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
void MQTTManager::callbackFunction(char* topic, byte* payload,
                                   unsigned int length) {
  Serial.println("Received MQTT message");
  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.write(payload, length);
  Serial.println();
  payload[length] = '\0';  // Add a null terminator to the payload

  if (strcmp(topic, instance->appConfig->mqttManager.statusTopic.c_str()) ==
      0) {
    instance->statusCallback(payload, length);
  } else if (strcmp(topic,
                    instance->appConfig->mqttManager.configTopic.c_str()) ==
             0) {
    instance->configCallback(payload, length);
  } else if (strcmp(topic,
                    instance->appConfig->mqttManager.authTopic.c_str()) == 0) {
    instance->authCallback(payload, length);
  }
}

void MQTTManager::statusCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received status message");
  // create a json with the most relevant app info from the app config
  // and the payload
  StaticJsonDocument<1024> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();

  JsonObject wifiObj = jsonObj.createNestedObject("wifi");
  wifiObj[enumToString(WIFI_INITIALIZED)] =
      this->appConfig->wifiManager.status.initialized;
  wifiObj[enumToString(WIFI_CONNECTED_)] =
      this->appConfig->wifiManager.status.connected;
  wifiObj[enumToString(WIFI_CONNECTING)] =
      this->appConfig->wifiManager.status.connecting;
  wifiObj[enumToString(WIFI_DISCONNECTING)] =
      this->appConfig->wifiManager.status.disconnecting;
  wifiObj[enumToString(WIFI_HAS_ERROR)] =
      this->appConfig->wifiManager.status.hasError;
  wifiObj[enumToString(WIFI_ERROR)] = this->appConfig->wifiManager.status.error;
  wifiObj[enumToString(WIFI_STATUS)] =
      this->appConfig->wifiManager.status.status;

  JsonObject mqttObj = jsonObj.createNestedObject("mqtt");
  mqttObj[enumToString(MQTT_INITIALIZED)] =
      this->appConfig->mqttManager.status.initialized;
  mqttObj[enumToString(MQTT_CONNECTED_)] =
      this->appConfig->mqttManager.status.connected;
  mqttObj[enumToString(MQTT_CONNECTING)] =
      this->appConfig->mqttManager.status.connecting;
  mqttObj[enumToString(MQTT_DISCONNECTING)] =
      this->appConfig->mqttManager.status.disconnecting;
  mqttObj[enumToString(MQTT_HAS_ERROR)] =
      this->appConfig->mqttManager.status.hasError;
  mqttObj[enumToString(MQTT_ERROR)] = this->appConfig->mqttManager.status.error;
  mqttObj[enumToString(MQTT_STATUS)] =
      this->appConfig->mqttManager.status.status;

  JsonObject hwObj = jsonObj.createNestedObject("hw");
  hwObj[enumToString(HW_INITIALIZED)] =
      this->appConfig->hardwareManager.status.initialized;
  hwObj[enumToString(HW_CONNECTED)] =
      this->appConfig->hardwareManager.status.connected;
  hwObj[enumToString(HW_CONNECTING)] =
      this->appConfig->hardwareManager.status.connecting;
  hwObj[enumToString(HW_DISCONNECTING)] =
      this->appConfig->hardwareManager.status.disconnecting;
  hwObj[enumToString(HW_HAS_ERROR)] =
      this->appConfig->hardwareManager.status.hasError;
  hwObj[enumToString(HW_ERROR)] = this->appConfig->hardwareManager.status.error;
  hwObj[enumToString(HW_STATUS)] =
      this->appConfig->hardwareManager.status.status;

  this->publish(jsonObj, this->appConfig->mqttManager.statusTopic.c_str());
}

void MQTTManager::configCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received config message");
  // Serial.println(payload);
}

void MQTTManager::authCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received auth message");
}

// Actions
void MQTTManager::registerClient() {
  StaticJsonDocument<512> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();
  // Add message data
  jsonObj[enumToString(SENSOR_ID)] = this->appConfig->appInfo.sensorId;

  this->publish(jsonObj, this->appConfig->mqttManager.registerTopic.c_str(),
                false);
}

void MQTTManager::authenticateClient() {}

void MQTTManager::publishReadings(unsigned int readingRAW,
                                  unsigned int readingCM) {
  StaticJsonDocument<512> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();
  // Add message data
  jsonObj[enumToString(READING_RAW)] = readingRAW;
  jsonObj[enumToString(READING_CM)] = readingCM;

  this->publish(jsonObj, this->appConfig->mqttManager.dataTopic.c_str(), true);
}

// Base methods
void MQTTManager::subscribe() {
  if (mqttClient.connected()) {
    // Config topic
    mqttClient.subscribe(this->appConfig->mqttManager.configTopic.c_str());
    // Auth topic
    mqttClient.subscribe(this->appConfig->mqttManager.authTopic.c_str());
  }
}

void MQTTManager::publish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                          const char* topic, bool meta) {
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

void MQTTManager::addMetadata(JsonObject& metaObj) {
  metaObj[enumToString(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
  metaObj[enumToString(TIMESTAMP)] = millis();
}

// Setters
void MQTTManager::setMqttBasicInfo() {
  this->appConfig->mqttManager.statusTopic =
      this->appConfig->appInfo.sensorId + "/" + MQTT_STATUS_TOPIC;
  this->appConfig->mqttManager.configTopic =
      this->appConfig->appInfo.sensorId + "/" + MQTT_CONFIG_TOPIC;
  this->appConfig->mqttManager.dataTopic =
      this->appConfig->appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
  this->appConfig->mqttManager.authTopic =
      this->appConfig->appInfo.sensorId + "/" + MQTT_AUTH_TOPIC;
  this->appConfig->mqttManager.registerTopic = MQTT_REGISTER_TOPIC;

  // Serial.println("Status Topic");
  // Serial.println(this->appConfig->mqttManager.statusTopic);
  // Serial.println("Config Topic");
  // Serial.println(this->appConfig->mqttManager.configTopic);
  // Serial.println("Data Topic");
  // Serial.println(this->appConfig->mqttManager.dataTopic);
  // Serial.println("Auth Topic");
  // Serial.println(this->appConfig->mqttManager.authTopic);
  // Serial.println("Register Topic");
  // Serial.println(this->appConfig->mqttManager.registerTopic);
}

void MQTTManager::setMqttConnectionInfo() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
  mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
  mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
