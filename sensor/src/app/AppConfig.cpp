#include "AppConfig.h"

#include <ESP8266WiFi.h>

#include "../utils/constants.h"

///////////////////////////////////
/// AppConfig Class Constructor ///
///////////////////////////////////

AppConfig::AppConfig() {}

///////////////////////////////////
/// BoardInfo Class Constructor ///
///////////////////////////////////

AppConfig::BoardInfo::BoardInfo() {
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

AppConfig::WifiManagerInfo::WifiManagerInfo() {
    status = {false, false, false, false, false, "", ManagerStatusCode::MANAGER_STATUS_NONE};

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

AppConfig::MQTTManagerInfo::MQTTManagerInfo() {
    status = {false, false, false, false, false, "", ManagerStatusCode::MANAGER_STATUS_NONE};

    maxPacketSize = MQTT_MAX_PACKET_SIZE;
    keepAlive = MQTT_KEEP_ALIVE;
    version = MQTT_VERSION;
    connectionTimeout = MQTT_SERVER_CONNECTION_TIMEOUT;

    registerTopic = MQTT_REGISTER_TOPIC;
    dataTopic = MQTT_DATA_TOPIC;
    commandTopic = MQTT_COMMAND_TOPIC;
}

/////////////////////////////////////////
/// HWManager Class Constructor ///
/////////////////////////////////////////

AppConfig::HWManagerInfo::HWManagerInfo() {
    status = {false, false, false, false, false, "", ManagerStatusCode::MANAGER_STATUS_NONE};

    updateRate = LOG_RATE;
}
