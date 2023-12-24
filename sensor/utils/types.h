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

enum MESSAGE_KEYS {
  // Metadata
  MESSAGE_ID = 101,
  TIMESTAMP = 102,
  SENSOR_ID = 103,
  SENSOR_TIME = 104,
  MESSAGE_TYPE = 105,
  VERSION = 106,
  SENOSOR_KEY = 107,
  
  // Action
  ACTION_NAME = 201
};

enum MESSAGE_TYPES {
  DATA = 1,
  COMMAND = 2,
};

#endif  // TYPES_H
