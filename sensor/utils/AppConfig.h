#ifndef APPCONFIG_H
#define APPCONFIG_H
#include <ESP8266WiFi.h>

#include "constants.h"

struct ManagerStatus {
  bool initialized;    // Indicates whether the manager is initialized
  bool connected;      // Indicates whether the manager is connected
  bool connecting;     // Indicates whether the manager is currently connecting
  bool disconnecting;  // Indicates whether the manager is currently
                       // disconnecting
  bool hasError;       // Indicates whether an error has occurred
  String error;        // Error message
  int status;          // Status of the manager
};

class AppConfig {
 public:
  class BoardInfo {
   public:
    String boardChipId;           // Chip ID of the board
    uint32_t boardFlashChipId;    // Flash chip ID of the board
    String boardCoreVersion;      // Core version of the board
    uint32_t boardFlashChipSize;  // Flash chip size of the board
    uint32_t
        boardFlashChipRealSize;     // Real size of the flash chip on the board
    uint8_t boardCpuFreqMHz;        // CPU frequency of the board in MHz
    uint32_t boardFreeHeap;         // Amount of free heap memory on the board
    String boardHeapFragmentation;  // Heap fragmentation of the board
    uint32_t boardSketchSize;       // Size of the sketch on the board
    uint32_t boardFreeSketchSpace;  // Amount of free sketch space on the board
    String boardSketchMD5;          // MD5 hash of the sketch on the board
    uint32_t boardFlashChipSpeed;   // Speed of the flash chip on the board
    uint32_t boardCycleCount;       // Cycle count of the board
  };
  BoardInfo boardInfo;

  class AppInfo {
   public:
    String sensorId;  // ID of the sensor
  };
  AppInfo appInfo;

  class WifiManager {
   public:
    ManagerStatus status;

    // WiFi connection info
    String ssid;        // SSID of the WiFi connection
    IPAddress ip;       // IP address of the WiFi connection
    String hostname;    // Hostname of the WiFi connection
    IPAddress gateway;  // Gateway of the WiFi connection
    IPAddress subnet;   // Subnet of the WiFi connection
    String mac;         // MAC address of the WiFi connection
    int rssi;           // RSSI (Received Signal Strength Indicator) of the WiFi
                        // connection
    int channel;        // Channel of the WiFi connection
    int encryption;     // Encryption type of the WiFi connection
  };
  WifiManager wifiManager;

  class MQTTManager {
   public:
    ManagerStatus status;

    // MQTT connection info
    int maxPacketSize;      // Maximum packet size of the MQTT connection
    int keepAlive;          // Keep-alive interval of the MQTT connection
    int version;            // Version of the MQTT connection
    int connectionTimeout;  // Connection timeout of the MQTT connection

    // MQTT variables
    String dataTopic;      // Data topic of the MQTT connection
    String configTopic;    // Config topic of the MQTT connection
    String statusTopic;    // Status topic of the MQTT connection
    String authTopic;      // Auth topic of the MQTT connection
    String registerTopic;  // Register topic of the MQTT connection
  };
  MQTTManager mqttManager;

  class HardwareManager {
   public:
    ManagerStatus status;
  };
  HardwareManager hardwareManager;
};

#endif  // APPCONFIG_H