#ifndef UTILS_H
#define UTILS_H

#include "../App/AppConfig.h"
#include "constants.h"
#include "types.h"

// This function is used to generate a unique ID for each sensor.
String generateId(String boardId, String flashChipId) {
  MD5Builder md5;
  md5.begin();
  md5.add(boardId);
  md5.add(flashChipId);
  md5.calculate();
  return md5.toString();
}

// Function to generate a random string.
String generateRandomString(int length) {
  String randomString = "";
  String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Include all characters you want to include in the random string

  for (int i = 0; i < length; i++) {
    int randomIndex = random(characters.length()); // Get a random index within the length of the characters string
    randomString += characters.charAt(randomIndex); // Append the character at the random index to the random string
  }

  return randomString;
}

/* 
  This function is used to blink the built-in LED.
  The LED turns on for 100 milliseconds, then turns off for 100 milliseconds.
*/
void blink() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  delay(100);
}

/* 
  This function returns the string representation of the corresponding message type.
*/
const char* TYPE_TO_CHAR(MESSAGE_TYPES key) {
  switch (key) {
    case REGISTER:
      return "0";
    case DATA:
      return "1";
    case COMMAND:
      return "2";
    default:
      return "9999";
  }
}

/* 
  This function returns the string representation of the corresponding message action.
*/
const char* ACTION_TO_CHAR(MESSAGE_ACTIONS key) {
  switch (key) {
    case REGISTER_SENSOR:
      return "0";
    case SENSOR_DATA:
      return "1";
    // Add cases for other actions if needed
    default:
      return "9999";
  }
}

/* 
  This function returns the string representation of the corresponding message parameter.
*/
const char* PARAM_TO_CHAR(MESSAGE_PARAMETERS key) {
  switch (key) {
    // Metadata
    case MESSAGE_ID:
      return "101";
    case TIMESTAMP:
      return "102";
    case SENSOR_TIME:
      return "103";
    case VERSION:
      return "104";
    case SENSOR_ID:
      return "105";

    // Action
    case ACTION_TYPE:
      return "201";
    case ACTION_NAME:
      return "202";
    default:
      return "9999";
  }
}

#endif  // UTILS_H