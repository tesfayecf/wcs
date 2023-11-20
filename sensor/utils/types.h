#ifndef TYPES_H
#define TYPES_H

class WifiManager;
class MQTTManager;
class HWManager;

struct Managers {
  WifiManager* wifiManager;
  MQTTManager* mqttManager;
  HWManager* hwManager;
};

enum JSON_KEYS {
  // Wifi status
  WIFI_INITIALIZED = 101,
  WIFI_CONNECTED_ = 102,
  WIFI_CONNECTING = 103,
  WIFI_DISCONNECTING = 104,
  WIFI_HAS_ERROR = 105,
  WIFI_ERROR = 106,
  WIFI_STATUS = 107,

  // Mqtt status
  MQTT_INITIALIZED = 201,
  MQTT_CONNECTED_ = 202,
  MQTT_CONNECTING = 203,
  MQTT_DISCONNECTING = 204,
  MQTT_HAS_ERROR = 205,
  MQTT_ERROR = 206,
  MQTT_STATUS = 207,

  // Hardware status
  HW_INITIALIZED = 301,
  HW_CONNECTED = 302,
  HW_CONNECTING = 303,
  HW_DISCONNECTING = 304,
  HW_HAS_ERROR = 305,
  HW_ERROR = 306,
  HW_STATUS = 307,

  // Sensor meta
  SENSOR_ID = 401,
  SENSOR_TIME = 402,

  // Board meta
  BOARD_UPTIME = 501,
  BOARD_CHIP_ID = 502,
  BOARD_FLASH_CHIP_ID = 503,
  BOARD_VERSION = 504,
  BOARD_FREE_RAM = 505,
  BOARD_CPU_FREQ_MHZ = 506,

  // Wifi meta
  BOARD_WIFI_SSID = 601,
  BOARD_WIFI_HOSTNAME = 602,
  BOARD_WIFI_GATEWAY = 603,
  BOARD_WIFI_SUBNET = 604,
  BOARD_WIFI_MAC = 605,
  BOARD_WIFI_RSSI = 606,
  BOARD_WIFI_CHANNEL = 607,
  BOARD_WIFI_ENCRYPTION = 608,

  // Sensor readings
  READING_RAW = 701,
  READING_CM = 702,

  // LOG INFO
  TIMESTAMP = 801,
  MESSAGE = 802, 
};

enum MESSAGE_TYPES {
  // Status
  NOK = 0,
  OK = 1,

  // Commands
  AUTH = 2,
  REGISTER = 3,
  CONFIG = 4,
  START = 5,
  STOP = 6,
  RESET = 7,
  PING = 8,
  STATUS = 9,
  LOG = 10,
  INFO = 12,
  WARN = 13,
  ERROR = 14,
}

#endif  // TYPES_H
