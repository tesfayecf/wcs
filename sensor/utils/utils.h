#ifndef UTILS_H
#define UTILS_H

#include "../App/AppConfig.h"
#include "constants.h"
#include "types.h"

String generateId(String boardId, String flashChipId) {
  MD5Builder md5;
  md5.begin();
  md5.add(boardId);
  md5.add(flashChipId);
  md5.calculate();
  return md5.toString();
}

void blink() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  delay(100);
}

const char* ETS(MESSAGE_KEYS key) {
  switch (key) {
    // Metadata
    case MESSAGE_ID:
      return "101";
    case TIMESTAMP:
      return "102";
    case SENSOR_ID:
      return "103";
    case SENSOR_TIME:
      return "104";
    case MESSAGE_TYPE:
      return "105";
    case VERSION:
      return "106";

    // Action
    case ACTION_NAME:
      return "201";
    default:
      return "0";
    
  }
  // Handle the case when the enum value doesn't match any case.
  return "-";
}

#endif  // UTILS_H
