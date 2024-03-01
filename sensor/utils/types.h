#ifndef TYPES_H
#define TYPES_H

enum MESSAGE_TYPES {
  REGISTER = 0,
  DATA = 1,
  COMMAND = 2,
};

enum MESSAGE_ACTIONS {
  // Register
  REGISTER_SENSOR = 0,
  // Data
  SENSOR_DATA = 1,
  // Command
};

enum MESSAGE_PARAMETERS {
  // Metadata
  MESSAGE_ID = 101,
  TIMESTAMP = 102,
  SENSOR_TIME = 103,
  VERSION = 104,
  SENSOR_ID = 105,

  // Action
  ACTION_TYPE = 201,
  ACTION_NAME = 202,
};

struct MQTTMessage {
  MESSAGE_TYPES type;
  MESSAGE_ACTIONS action;
  const char* params[5];
  size_t paramsCount;
};

#endif  // TYPES_H
