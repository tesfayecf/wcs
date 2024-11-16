#ifndef APP_CONFIG_H
#define APP_CONFIG_H

#include <ESP8266WiFi.h>

////////////////////////////////
/// Manager Status Interface ///
////////////////////////////////

enum ManagerStatusCode {
  MANAGER_STATUS_INITIALIZED,
  MANAGER_STATUS_CONNECTED,
  MANAGER_STATUS_CONNECTING,
  MANAGER_STATUS_DISCONNECTING,
  MANAGER_STATUS_ERROR,
  MANAGER_STATUS_NONE
};

struct ManagerStatus {
  bool initialized;    // Indicates whether the manager is initialized
  bool connected;      // Indicates whether the manager is connected
  bool connecting;     // Indicates whether the manager is currently connecting
  bool disconnecting;  // Indicates whether the manager is currently disconnecting
  bool hasError;       // Indicates whether an error has occurred
  String error;        // Error message
  ManagerStatusCode status;          // Status of the manager
};

///////////////////////
/// AppConfig Class ///
///////////////////////

class AppConfig {
 public:
  // Constructor
  AppConfig();

  ///////////////////////
  /// BoardInfo Class ///
  ///////////////////////

  class BoardInfo {
   public:
    // Constructor
    BoardInfo();

    String boardChipId;               // Chip ID of the board
    uint32_t boardFlashChipId;        // Flash chip ID of the board
    String boardCoreVersion;          // Core version of the board
    uint32_t boardFlashChipSize;      // Flash chip size of the board
    uint32_t boardFlashChipRealSize;  // Real size of the flash chip on the board
    uint8_t boardCpuFreqMHz;          // CPU frequency of the board in MHz
    uint32_t boardFreeHeap;           // Amount of free heap memory on the board
    uint8_t boardHeapFragmentation;   // Heap fragmentation of the board
    uint32_t boardSketchSize;         // Size of the sketch on the board
    uint32_t boardFreeSketchSpace;    // Amount of free sketch space on the board
    String boardSketchMD5;            // MD5 hash of the sketch on the board
    uint32_t boardFlashChipSpeed;     // Speed of the flash chip on the board
    uint32_t boardCycleCount;         // Cycle count of the board
  };

  /////////////////////
  /// AppInfo Class ///
  /////////////////////

  class AppInfo {
   public:
    // Constructor
    AppInfo();

    String sensorId;           // ID of the sensor
    long startTime;            // Start timestamp of the sensor
    long localTime;            // Local timestamp of the sensor
    time_t serverTime;         // Timestamp of the sensor
    boolean authenticated;     // Indicates if the sensor is authenticated
    boolean registered;        // Indicates if the sensor is registred
  };

  /////////////////////////
  /// WifiManager Class ///
  /////////////////////////

  class WifiManagerInfo {
   public:
    // Constructor
    WifiManagerInfo();

    // Manager status
    ManagerStatus status;

    // Wifi connection info
    String ssid;        // SSID of the WiFi connection
    IPAddress ip;       // IP address of the WiFi connection
    String hostname;    // Hostname of the WiFi connection
    IPAddress gateway;  // Gateway of the WiFi connection
    IPAddress subnet;   // Subnet of the WiFi connection
    String mac;         // MAC address of the WiFi connection
    int rssi;           // (Received Signal Strength Indicator) of WiFi connection
    int channel;        // Channel of the WiFi connection
    int encryption;     // Encryption type of the WiFi connection
  };

  /////////////////////////
  /// MQTTManager Class ///
  /////////////////////////

  class MQTTManagerInfo {
    public:
    // Constructor
    MQTTManagerInfo();

    // Manager status
    ManagerStatus status;

    // MQTT connection info
    int maxPacketSize;      // Maximum packet size of the MQTT connection
    int keepAlive;          // Keep-alive interval of the MQTT connection
    int version;            // Version of the MQTT connection
    int connectionTimeout;  // Connection timeout of the MQTT connection

    // Publish topics
    String dataTopic;       // Data topic of the MQTT connection
    String registerTopic;   // Register topic of the MQTT connection
    // Subscribe topic
    String commandTopic;    // Command topic of the MQTT connection
  };

  ///////////////////////
  /// HWManager Class ///
  ///////////////////////

  class HWManagerInfo {
   public:
    // Constructor
    HWManagerInfo();

    // Manager status
    ManagerStatus status;

    // Hardware info
    int updateRate;
  };

  //////////////////
  /// Initialize ///
  //////////////////

  // INFO
  BoardInfo boardInfo;
  AppInfo appInfo;

  // MANAGEMENT
  WifiManagerInfo wifiManagerInfo;
  MQTTManagerInfo mqttManagerInfo;
  HWManagerInfo hwManagerInfo;
};

#endif  // APP_CONFIG_H
