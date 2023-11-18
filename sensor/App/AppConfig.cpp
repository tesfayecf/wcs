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
  // Constructor for the AppInfo class.
  timeUrl = TIME_URL;
}

/////////////////////////////////////
/// WifiManager Class Constructor ///
/////////////////////////////////////

AppConfig::WifiManager::WifiManager() {
  // Constructor for the WifiManager class.
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
  // Constructor for the MQTTManager class.
  status = {false, false, false, false, false, "", 0};

  maxPacketSize = MQTT_MAX_PACKET_SIZE;
  keepAlive = MQTT_KEEP_ALIVE;
  version = MQTT_VERSION;
  connectionTimeout = MQTT_CONNECTION_TIMEOUT_CUSTOM;
}

/////////////////////////////////////////
/// HardwareManager Class Constructor ///
/////////////////////////////////////////

AppConfig::HardwareManager::HardwareManager() {
  // Constructor for the HardwareManager class.
  status = {false, false, false, false, false, "", 0};
}
