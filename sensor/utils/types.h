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

struct MQTTMessage {
  MESSAGE_TYPES type;
  MESSAGE_ACTIONS action;
  const char* params[5];
  size_t paramsCount;
};

enum MESSAGE_PARAMETERS {
  // Metadata
  MESSAGE_ID = 101,
  TIMESTAMP = 102,
  SENSOR_ID = 103,
  SENSOR_TIME = 104,
  MESSAGE_TYPE = 105,
  VERSION = 106,

  // Action
  ACTION_TYPE = 201,
  ACTION_NAME = 202,
};

enum MESSAGE_ACTIONS {
  // Register
  REGISTER_SENSOR = 0,
  // Data
  // Command
};

enum MESSAGE_TYPES {
  REGISTER = 0,
  DATA = 1,
  COMMAND = 2,
};

#endif  // TYPES_H
