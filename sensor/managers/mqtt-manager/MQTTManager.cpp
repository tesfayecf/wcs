#include "MQTTManager.h"

#include <ArduinoJson.h>
#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

MQTTManager* MQTTManager::instance = nullptr;

MQTTManager::MQTTManager() : mqttClient(wifiClient) { instance = this; }

void MQTTManager::init(AppConfig* config_, Managers* managers_) {
  Serial.println("MQTTManager init");
  managers = managers_;
  appConfig = config_;
}

void MQTTManager::setup() {
  Serial.println("Initializing MQTTManager");
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  this->setMqttConnectionInfo();
  mqttClient.setCallback(callbackFunction);
  Serial.println("MQTT server set");

  connectMQTT();
  // TODO: subscribe to server topics: sensorID/status, sensorID/timer, ...
  subscribe(this->appConfig->mqttManager.statusTopic.c_str());
  subscribe(this->appConfig->mqttManager.configTopic.c_str());

  Serial.println("MQTTManager Initialized");
}

void MQTTManager::callbackFunction(char* topic, byte* payload,
                                   unsigned int length) {
  if (strcmp(topic, instance->appConfig->mqttManager.statusTopic.c_str()) ==
      0) {
    instance->statusCallback(payload, length);
  } else if (strcmp(topic,
                    instance->appConfig->mqttManager.configTopic.c_str()) ==
             0) {
    instance->configCallback(payload, length);
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
  wifiObj[enumToString(WIFI_STATUS)] = this->appConfig->wifiManager.status.status;

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
  mqttObj[enumToString(MQTT_STATUS)] = this->appConfig->mqttManager.status.status;

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
  hwObj[enumToString(HW_STATUS)] = this->appConfig->hardwareManager.status.status;

  this->basePublish(jsonObj, this->appConfig->mqttManager.dataTopic.c_str());
}

void MQTTManager::configCallback(uint8_t* payload, unsigned int length) {
  Serial.println("Received config message");
}

void MQTTManager::loop() {
  // if (!mqttClient.connected()) {
  //   reconnect();
  // }

  if (millis() % 10000 == 0) {
    unsigned int distanceRaw;
    unsigned long distanceCM;

    // Read data
    managers->hwManager->readSensorValues(distanceRaw, distanceCM);

    // Publish data
    publishReadings(distanceRaw, distanceCM);
  }

  mqttClient.loop();
}

void MQTTManager::connectMQTT() {
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
  connectMQTT();
}

void MQTTManager::subscribe(const char* topic) {
  if (mqttClient.connected()) {
    mqttClient.subscribe(topic);
  }
}

void MQTTManager::publishReadings(unsigned int readingRAW,
                                  unsigned long readingCM) {
  StaticJsonDocument<200> jsonDoc;
  JsonObject jsonObj = jsonDoc.to<JsonObject>();
  // Add message data
  jsonObj[enumToString(READING_RAW)] = readingRAW;
  jsonObj[enumToString(READING_CM)] = readingCM;

  this->basePublish(jsonObj, this->appConfig->mqttManager.dataTopic.c_str());
}

void MQTTManager::basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                              const char* topic) {
  JsonObject metaObj = dataObject.createNestedObject("meta");

  // Add sensor metadata
  this->addMetadata(metaObj);
  // Get max size of websocket message
  char websocketMessageChar[1024];
  // Serialize message
  serializeJson(dataObject, websocketMessageChar, 1024);
  // Publish message
  mqttClient.publish(topic, websocketMessageChar);

  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(websocketMessageChar);
}

void MQTTManager::addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject) {
  // Sensor meta
  dataObject[enumToString(SENSOR_ID)] = this->appConfig->appInfo.sensorId;

  dataObject[enumToString(BOARD_UPTIME)] = millis();
  dataObject[enumToString(BOARD_CHIP_ID)] =
      this->appConfig->boardInfo.boardChipId;
  dataObject[enumToString(BOARD_FLASH_CHIP_ID)] =
      this->appConfig->boardInfo.boardFlashChipId;
  dataObject[enumToString(BOARD_VERSION)] =
      this->appConfig->boardInfo.boardCoreVersion;
  dataObject[enumToString(BOARD_FREE_RAM)] =
      this->appConfig->boardInfo.boardFreeHeap;
  dataObject[enumToString(BOARD_CPU_FREQ_MHZ)] =
      this->appConfig->boardInfo.boardCpuFreqMHz;

  // Wifi meta
  dataObject[enumToString(BOARD_WIFI_SSID)] = this->appConfig->wifiManager.ssid;
  dataObject[enumToString(BOARD_WIFI_HOSTNAME)] =
      this->appConfig->wifiManager.hostname;
  dataObject[enumToString(BOARD_WIFI_GATEWAY)] =
      this->appConfig->wifiManager.gateway;
  dataObject[enumToString(BOARD_WIFI_SUBNET)] =
      this->appConfig->wifiManager.subnet;
  dataObject[enumToString(BOARD_WIFI_MAC)] = this->appConfig->wifiManager.mac;
  dataObject[enumToString(BOARD_WIFI_RSSI)] = this->appConfig->wifiManager.rssi;
  dataObject[enumToString(BOARD_WIFI_CHANNEL)] =
      this->appConfig->wifiManager.channel;
  dataObject[enumToString(BOARD_WIFI_ENCRYPTION)] =
      this->appConfig->wifiManager.encryption;
}

void MQTTManager::setMqttConnectionInfo() {
  this->appConfig->mqttManager.maxPacketSize = MQTT_MAX_PACKET_SIZE;
  this->appConfig->mqttManager.keepAlive = MQTT_KEEPALIVE;
  this->appConfig->mqttManager.version = MQTT_VERSION;
  this->appConfig->mqttManager.connectionTimeout = MQTT_CONNECTION_TIMEOUT;

  char dataTopic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(dataTopic, "%s/data", this->appConfig->appInfo.sensorId.c_str());
  this->appConfig->mqttManager.dataTopic = dataTopic;
  Serial.println("this->appConfig->mqttManager.dataTopic");
  Serial.println(this->appConfig->mqttManager.dataTopic);

  char statusTopic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(statusTopic, "%s/status", this->appConfig->appInfo.sensorId.c_str());
  this->appConfig->mqttManager.statusTopic = statusTopic;

  char configTopic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(configTopic, "%s/config", this->appConfig->appInfo.sensorId.c_str());
  this->appConfig->mqttManager.configTopic = configTopic;
}