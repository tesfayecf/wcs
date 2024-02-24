#ifndef CONSTANTS_H
#define CONSTANTS_H

//////////////////
/// APP STATUS ///
//////////////////

#define DEBUG True

//////////////////
/// APP CONFIG ///
//////////////////

#define APP_NAME "Sensor"
#define APP_VERSION "0.1"

#define EEPROM_SIZE 512

/// INFO ///

////////////////
/// APP INFO ///
////////////////

#define TIME_URL "http://worldtimeapi.org/api/ip"

/// MANAGERS ///

////////////////////
/// WIFI MANAGER ///
////////////////////

#define SERVER_PORT 80
#define SSID_START_ADDR 0
#define PASSWORD_START_ADDR 100
#define WIFI_CONNECTION_TIMEOUT 250

////////////////////
/// MQTT MANAGER ///
////////////////////

#define MQTT_BROKER "192.168.1.6"  // MQTT Broker IP Address
#define MQTT_PORT 1883              // MQTT Broker Port

#define MQTT_VERSION 5  // MQTT Protocol Version (e.g., 3.1, 3.1.1, 5)
#define MQTT_MAX_PACKET_SIZE 1024
#define MQTT_KEEP_ALIVE 60
#define MQTT_CONNECTION_TIMEOUT_CUSTOM 10

#define MQTT_DATA_TOPIC "data"  // MQTT Data Topic
#define MQTT_COMMAND_TOPIC "command"  // MQTT Command Topic
#define MQTT_REGISTER_TOPIC "server/register"  // MQTT Register Topic
#define MQTT_META_KEY "meta"
#define MQTT_ACTION_KEY "action"

////////////////////////
/// HARDWARE MANAGER ///
////////////////////////

#define TRIGGER_PIN D6  // Trigger Pin (e.g., for ultrasonic sensor)
#define ECHO_PIN D7     // Echo Pin (e.g., for ultrasonic sensor)
#define TIMEOUT 25200   // Timeout value for hardware operations

#define UPDATE_RATE 10000

#endif  // CONSTANTS_H
