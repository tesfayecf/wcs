#include "AppConfig.h"

#include <ESP8266WiFi.h>

#include "../utils/constants.h"
#include "./AppConfig.h"

////////////////////////////////////
/// AppConfig Class Constructors ///
////////////////////////////////////

AppConfig::AppConfig() {}

///////////////////////////////////
/// BoardInfo Class Constructor ///
///////////////////////////////////

AppConfig::BoardInfo::BoardInfo() {}

//////////////////////////////////
/// AppInfo Class Constructors ///
//////////////////////////////////

AppConfig::AppInfo::AppInfo() {
  sensorId = "";
  startTime = 0; // TODO: Get from api or server when register
  localTime = 0;
  serverTime = 0;
  authenticated = false;
  registered = false;    
}

/////////////////////////////////////
/// WifiManager Class Constructor ///
/////////////////////////////////////

AppConfig::WifiManager::WifiManager() {
  status = {false, false, false, false, false, "", 0};

  ssid = "";
  ip = IPAddress(0, 0, 0, 0);
  hostname = "";
  gateway = IPAddress(0, 0, 0, 0);
  subnet = IPAddress(0, 0, 0, 0);
  mac = "";
  rssi = 0;
  channel = 0;
  encryption = 0;
}

/////////////////////////////////////
/// MQTTManager Class Constructor ///
/////////////////////////////////////

AppConfig::MQTTManager::MQTTManager() {
  status = {false, false, false, false, false, "", 0};

  maxPacketSize = MQTT_MAX_PACKET_SIZE;
  keepAlive = MQTT_KEEP_ALIVE;
  version = MQTT_VERSION;
  connectionTimeout = MQTT_CONNECTION_TIMEOUT_CUSTOM;

  // Publish topics
  registerTopic = MQTT_REGISTER_TOPIC;
  dataTopic = MQTT_DATA_TOPIC;
  // Subscribe topics
  commandTopic = MQTT_COMMAND_TOPIC;
}

/////////////////////////////////////////
/// HardwareManager Class Constructor ///
/////////////////////////////////////////

AppConfig::HardwareManager::HardwareManager() {
  status = {false, false, false, false, false, "", 0};

  updateRate = LOG_RATE;
}
