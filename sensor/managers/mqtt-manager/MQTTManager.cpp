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

  // TODO: subscribe to server topics: sensorID/status, sensorID/timer, ...
  // subscribe(this->appConfig->mqttManager.statusTopic.c_str());
  // subscribe(this->appConfig->mqttManager.registerTopic.c_str());

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
    managers->hwManager->readSensorValues(distanceRaw, distanceCM);

    // Publish data
    // publishReadings(distanceRaw, distanceCM);
  }

  mqttClient.loop();
}

/**
 * @brief Connects to the MQTT broker.
 *
 * @details This function connects to the MQTT broker using the provided client
 * ID. If the connection is successful, it prints "MQTT connected" to the serial
 * monitor. If the connection fails, it prints "MQTT connection failed" to the
 * serial monitor.
 */
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

/**
 * @brief Reconnects to the MQTT broker.
 *
 * @details This function disconnects from the MQTT broker and then calls the
 * `connectMQTT()` function to reconnect.
 */
void MQTTManager::reconnect() {
  mqttClient.disconnect();
  this->connect();
}

/**
 * @brief Callback function for MQTT messages.
 *
 * @param topic The topic of the received message.
 * @param payload The payload of the received message.
 * @param length The length of the payload.
 *
 * @details This function is called when a new MQTT message is received.
 * It checks the topic of the message and calls the corresponding callback
 * function based on the topic.
 */
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

/**
 * @brief Callback function for status messages.
 *
 * @param payload The payload of the status message.
 * @param length The length of the payload.
 *
 * @details This function is called when a status message is received.
 * It creates a JSON object with the relevant app information and the payload,
 * and then calls the `basePublish()` function to publish the JSON object to
 * the MQTT broker.
 */
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

  this->basePublish(jsonObj, this->appConfig->mqttManager.statusTopic.c_str());
}

/**
 * @brief Callback function for config messages.
 *
 * @param payload The payload of the config message.
 * @param length The length of the payload.
 *
 * @details This function is called when a config message is received.
 *
 */
void MQTTManager::configCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received config message");
}

/**
 * @brief Callback function for register messages.
 *
 * @param payload The payload of the register message.
 * @param length The length of the payload.
 *
 * @details This function is called when a register message is received.
 */
void MQTTManager::authCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received auth message");
}

void MQTTManager::registerClient() {
  StaticJsonDocument<512> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();
  // Add message data
  jsonObj[enumToString(SENSOR_ID)] = this->appConfig->appInfo.sensorId;

  this->basePublish(jsonObj, this->appConfig->mqttManager.registerTopic.c_str(),
                    false);
}

void MQTTManager::authenticateClient() {}

/**
 * @brief Subscribes to a given MQTT topic.
 *
 * @param topic The topic to subscribe to.
 *
 * @details This function subscribes to the specified MQTT topic if the MQTT
 * client is connected.
 */
void MQTTManager::subscribe(const char* topic) {
  if (mqttClient.connected()) {
    mqttClient.subscribe(topic);
  }
}

/**
 * @brief Publishes sensor readings to the MQTT broker.
 *
 * @param readingRAW The raw reading value.
 * @param readingCM The reading value in centimeters.
 *
 * @details This function creates a JSON object with the sensor readings and
 * calls the `basePublish()` function to publish the JSON object to the MQTT
 * broker.
 */
void MQTTManager::publishReadings(unsigned int readingRAW,
                                  unsigned int readingCM) {
  StaticJsonDocument<512> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();
  // Add message data
  jsonObj[enumToString(READING_RAW)] = readingRAW;
  jsonObj[enumToString(READING_CM)] = readingCM;

  this->basePublish(jsonObj, this->appConfig->mqttManager.dataTopic.c_str());
}

/**
 * @brief Publishes a JSON object to the MQTT broker.
 *
 * @param dataObject The JSON object to publish.
 * @param topic The MQTT topic to publish to.
 *
 * @details This function serializes the JSON object, publishes it to the MQTT
 * broker using the specified topic, and prints the published message to the
 * serial monitor.
 */
void MQTTManager::basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
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

/**
 * @brief Adds sensor metadata to the JSON object.
 *
 * @param metaObj The JSON object to add metadata to.
 *
 * @details This function adds sensor metadata such as sensor ID, sensor type,
 * location, and timestamp to the JSON object.
 */
void MQTTManager::addMetadata(JsonObject& metaObj) {
  metaObj[enumToString(SENSOR_ID)] = this->appConfig->appInfo.sensorId;
  metaObj[enumToString(TIMESTAMP)] = millis();
}

/**
 * @brief Sets the MQTT basic information.
 *
 * @details This function sets the topics to subscribe and publish for the MQTT
 * client.
 */
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

  Serial.println("Status Topic");
  Serial.println(this->appConfig->mqttManager.statusTopic);
  Serial.println("Config Topic");
  Serial.println(this->appConfig->mqttManager.configTopic);
  Serial.println("Data Topic");
  Serial.println(this->appConfig->mqttManager.dataTopic);
  Serial.println("Auth Topic");
  Serial.println(this->appConfig->mqttManager.authTopic);
  Serial.println("Register Topic");
  Serial.println(this->appConfig->mqttManager.registerTopic);
}

/**
 * @brief Sets the MQTT connection information.
 *
 * @details This function sets the keep alive, socket timeout, and buffer size
 * for the MQTT client.
 */
void MQTTManager::setMqttConnectionInfo() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
  mqttClient.setSocketTimeout(MQTT_CONNECTION_TIMEOUT_CUSTOM);
  mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE);
}
