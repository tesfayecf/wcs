#include "MQTTManager.h"

#include <ArduinoJson.h>
#include <Base64.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"

MQTTManager::MQTTManager() : mqttClient(wifiClient) {}

void MQTTManager::init(AppConfig* config_, Managers* managers_) {
  Serial.println("MQTTManager init");
  managers = managers_;
  appConfig = config_;
}

void MQTTManager::setup() {
  Serial.println("Initializing MQTTManager");
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(callbackFunction);
  Serial.println("MQTT server set");

  connectMQTT();
  // TODO: subscribe to server topics: sensorID/status, sensorID/timer, ...
  char statusTopic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(statusTopic, "%s/status", this->appConfig->appInfo.sensorId.c_str());
  subscribe(statusTopic);
  char configTopic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(configTopic, "%s/config", this->appConfig->appInfo.sensorId.c_str());
  subscribe(configTopic);

  Serial.println("MQTTManager Initialized");
}

void MQTTManager::loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }

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

void MQTTManager::onMessageReceived(char* topic, byte* payload,
                                    unsigned int length) {
  Serial.print(topic);
}

void MQTTManager::callbackFunction(char* topic, byte* payload, unsigned int length) {
  Serial.println(topic);
  // Serial.println(payload.toString());
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
  jsonObj["readingRAW"] = readingRAW;
  jsonObj["readingCM"] = readingCM;

  // Set topiec
  // Get length of sensorid
  char topic[this->appConfig->appInfo.sensorId.length() + 10];
  sprintf(topic, "%s/data", this->appConfig->appInfo.sensorId.c_str());

  this->basePublish(jsonObj, topic);
}

void MQTTManager::basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                              const char* topic) {
  // Add sensor metadata
  this->addMetadata(dataObject);
  // Get max size of websocket message
  char websocketMessageChar[200];
  // Serialize message
  serializeJson(dataObject, websocketMessageChar, 200);
  // Publish message
  mqttClient.publish(topic, websocketMessageChar);

  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(websocketMessageChar);
}

void MQTTManager::addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject) {
  dataObject["sensorId"] = this->appConfig->appInfo.sensorId;
  dataObject["boardUptime"] = millis();

  // // Board meta
  // dataObject["boardChipID"] = this->appConfig->boardInfo.boardChipId;
  // dataObject["boardFlashChipId"] = this->appConfig->boardInfo.boardFlashChipId;
  // dataObject["boardType"] = ESP.getChipModel();
  // dataObject["boardVersion"] = ESP.getCoreVersion();
  // dataObject["boardFlashSize"] = ESP.getFlashChipSize();
  // dataObject["boardFreeHeap"] = ESP.getFreeHeap();
  // dataObject["boardFreeRam"] = ESP.getFreeRam();
  // dataObject["boardVersion"] = ESP.getSdkVersion();

  // // Wifi meta
  // dataObject["boardStatus"] = WiFi.status();
  // dataObject["boardRSSI"] = WiFi.RSSI();
  // dataObject["boardName"] = WiFi.hostname();
  // dataObject["boardMac"] = WiFi.macAddress();
  // dataObject["boardWifiChannel"] = WiFi.channel();
  // dataObject["boardWifiMode"] = WiFi.getMode();
  // dataObject["boardWifiSSID"] = WiFi.SSID();
  // dataObject["boardWifiSignal"] = WiFi.RSSI();
  // dataObject["boardWifiVersion"] = WiFi.getVersion();
  // // Add any other desired data fields
}

void MQTTManager::setMqttConnectionInfo() {
  this->appConfig->mqttManager.maxPacketSize = MQTT_MAX_PACKET_SIZE;
  this->appConfig->mqttManager.keepAlive = MQTT_KEEPALIVE;
  this->appConfig->mqttManager.version = MQTT_VERSION;
  this->appConfig->mqttManager.connectionTimeout = MQTT_CONNECTION_TIMEOUT;
}