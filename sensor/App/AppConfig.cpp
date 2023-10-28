#include "AppConfig.h"

#include <ESP8266WiFi.h>

#include "../utils/constants.h"
#include "./AppConfig.h"

////////////////////////////////////
/// AppConfig Class Constructors ///
////////////////////////////////////

AppConfig::AppConfig() {
  // Constructor for the AppConfig class.
}

///////////////////////////////////
/// BoardInfo Class Constructor ///
///////////////////////////////////

AppConfig::BoardInfo::BoardInfo() {
  // Constructor for the BoardInfo class.

  boardChipId = ESP.getChipId();
  boardFlashChipId = ESP.getFlashChipId();
  boardCoreVersion = ESP.getCoreVersion();
  boardFlashChipSize = ESP.getFlashChipSize();
  boardFlashChipRealSize = ESP.getFlashChipRealSize();
  boardCpuFreqMHz = ESP.getCpuFreqMHz();
  boardFreeHeap = ESP.getFreeHeap();
  boardHeapFragmentation = ESP.getHeapFragmentation();
  boardSketchSize = ESP.getSketchSize();
  boardFreeSketchSpace = ESP.getFreeSketchSpace();
  boardSketchMD5 = ESP.getSketchMD5();
  boardFlashChipSpeed = ESP.getFlashChipSpeed();
  boardCycleCount = ESP.getCycleCount();
}

// AppConfig::BoardInfo::printInfo() {
//   Serial.println("Board info:");
//   Serial.print("Board Chip ID: ");
//   Serial.println(this->appConfig.boardInfo.boardChipId);
//   Serial.print("Board Flash Chip ID: ");
//   Serial.println(this->appConfig.boardInfo.boardFlashChipId);
//   Serial.print("Board Core Version: ");
//   Serial.println(this->appConfig.boardInfo.boardCoreVersion);
//   Serial.print("Board Flash Chip Size: ");
//   Serial.println(this->appConfig.boardInfo.boardFlashChipSize);
//   Serial.print("Board Flash Chip Real Size: ");
//   Serial.println(this->appConfig.boardInfo.boardFlashChipRealSize);
//   Serial.print("Board CPU Frequency: ");
//   Serial.println(this->appConfig.boardInfo.boardCpuFreqMHz);
//   Serial.print("Board Free Heap: ");
//   Serial.println(this->appConfig.boardInfo.boardFreeHeap);
//   Serial.print("Board Heap Fragmentation: ");
//   Serial.println(this->appConfig.boardInfo.boardHeapFragmentation);
//   Serial.print("Board Sketch Size: ");
//   Serial.println(this->appConfig.boardInfo.boardSketchSize);
// }

//////////////////////////////////
/// AppInfo Class Constructors ///
//////////////////////////////////

String AppConfig::AppInfo::generateId(String boardId, String flashChipId) {
  MD5Builder md5;
  md5.begin();
  md5.add(boardId);
  md5.add(flashChipId);
  md5.calculate();
  return md5.toString();
}

AppConfig::AppInfo::AppInfo() {
  // Constructor for the AppInfo class.

  sensorId = generateId(boardInfo.boardChipId, boardInfo.boardFlashChipId);
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
  connectionTimeout = MQTT_CONNECTION_TIMEOUT;

  // Initialize default values for MQTT topics
  statusTopic = appConfig.appInfo.sensorId + "/" + MQTT_STATUS_TOPIC;
  configTopic = appConfig.appInfo.sensorId + "/" + MQTT_CONFIG_TOPIC;
  dataTopic = appConfig.appInfo.sensorId + "/" + MQTT_DATA_TOPIC;
  authTopic = appConfig.appInfo.sensorId + "/" + MQTT_AUTH_TOPIC;
  registerTopic = MQTT_REGISTER_TOPIC;
}

/////////////////////////////////////////
/// HardwareManager Class Constructor ///
/////////////////////////////////////////

AppConfig::HardwareManager::HardwareManager() {
  // Constructor for the HardwareManager class.
  status = {false, false, false, false, false, "", 0};
}
