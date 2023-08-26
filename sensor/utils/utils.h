#ifndef UTILS_H
#define UTILS_H

#include "../../utils/constants.h"
#include "../../utils/types.h"

const char* enumToString(JSON_KEYS key) {
  switch (key) {
    // Wifi status
    case WIFI_INITIALIZED:
      return "101";
    case WIFI_CONNECTED_:
      return "101";
    case WIFI_CONNECTING:
      return "102";
    case WIFI_DISCONNECTING:
      return "103";
    case WIFI_HAS_ERROR:
      return "104";
    case WIFI_ERROR:
      return "105";
    case WIFI_STATUS:
      return "106";

    // Mqtt status
    case MQTT_INITIALIZED:
      return "201";
    case MQTT_CONNECTED_:
      return "202";
    case MQTT_CONNECTING:
      return "203";
    case MQTT_DISCONNECTING:
      return "204";
    case MQTT_HAS_ERROR:
      return "205";
    case MQTT_ERROR:
      return "206";
    case MQTT_STATUS:
      return "207";

    // Hardware status
    case HW_INITIALIZED:
      return "301";
    case HW_CONNECTED:
      return "302";
    case HW_CONNECTING:
      return "303";
    case HW_DISCONNECTING:
      return "304";
    case HW_HAS_ERROR:
      return "305";
    case HW_ERROR:
      return "306";
    case HW_STATUS:
      return "307";

    // Sensor meta
    case SENSOR_ID:
      return "401";

    // Board meta
    case BOARD_UPTIME:
      return "501";
    case BOARD_CHIP_ID:
      return "502";
    case BOARD_FLASH_CHIP_ID:
      return "503";
    case BOARD_VERSION:
      return "504";
    case BOARD_FREE_RAM:
      return "505";
    case BOARD_CPU_FREQ_MHZ:
      return "506";

    // Wifi meta
    case BOARD_WIFI_SSID:
      return "601";
    case BOARD_WIFI_HOSTNAME:
      return "602";
    case BOARD_WIFI_GATEWAY:
      return "603";
    case BOARD_WIFI_SUBNET:
      return "604";
    case BOARD_WIFI_MAC:
      return "605";
    case BOARD_WIFI_RSSI:
      return "606";
    case BOARD_WIFI_CHANNEL:
      return "607";
    case BOARD_WIFI_ENCRYPTION:
      return "608";

    // Sensor readings
    case READING_RAW:
      return "701";
    case READING_CM:
      return "702";
  }
  // Handle the case when the enum value doesn't match any case.
  return "0";
}

// // Function to add an element to a JSON object
// bool addToJsonObject(JsonObject& jsonObject, JSON_KEYS key, const char* value) {
//     char charKey = enumToString(key);

//     // Check if the key is already present in the JSON object
//     if (jsonObject.containsKey(charKey)) {
//         // Key is already present, return false to indicate failure
//         return false;
//     }

//     // Add the key-value pair to the JSON object
//     jsonObject[charKey] = value;

//     // Return true to indicate success
//     return true;
// }

#endif  // UTILS_H
