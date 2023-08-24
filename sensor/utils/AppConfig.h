#ifndef APPCONFIG_H
#define APPCONFIG_H
#include <ESP8266WiFi.h>

#include "constants.h"

class AppConfig {
 public:
  class BoardInfo {
   public:
    String boardChipId;
    uint32_t boardFlashChipId;
    String boardCoreVersion;
    uint32_t boardFlashChipSize;
    uint32_t boardFlashChipRealSize;
    uint8_t boardCpuFreqMHz;
    uint32_t boardFreeHeap;
    String boardHeapFragmentation;
    uint32_t boardSketchSize;
    uint32_t boardFreeSketchSpace;
    String boardSketchMD5;
    uint32_t boardFlashChipSpeed;
    uint32_t boardCycleCount;
  };

  BoardInfo boardInfo;

  class AppInfo {
   public:
    String sensorId;
  };
  AppInfo appInfo;

  // Managers Info
  class WifiManager {
   public:
    // Manager status info
    bool initialized;
    bool connected;
    bool connecting;
    bool reconnecting;
    bool disconnecting;
    bool hasError;
    String error;
    int status;

    // WiFi connection info
    String ssid;
    IPAddress ip;
    String hostname;
    IPAddress gateway;
    IPAddress subnet;
    String mac;
    int rssi;
    int channel;
    int encryption;
  };
  WifiManager wifiManager;

  class MQTTManager {
   public:
    // Manager status info
    bool initialized;
    bool connected;
    bool connecting;
    bool reconnecting;
    bool disconnecting;
    bool hasError;
    String error;
    int status;

    // MQTT connection info
    int maxPacketSize;
    int keepAlive;
    int version;
    int connectionTimeout;
  };
  MQTTManager mqttManager;

  class HardwareManager {
   public:
    // Status info
    bool initialized;
    bool connected;
    bool connecting;
    bool reconnecting;
    bool disconnecting;
    bool hasError;
    String error;
    int status;
  };
  HardwareManager hardwareManager;
};

#endif  // APPCONFIG_H
