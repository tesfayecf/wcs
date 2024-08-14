#ifndef CONSTANTS_H
#define CONSTANTS_H

//////////////////
/// APP STATUS ///
//////////////////

#define DEBUG true
#define VERBOSE_LOGGING true

//////////////////
/// APP CONFIG ///
//////////////////

#define APP_NAME "Sensor"
#define APP_VERSION "1.0.0"

#define EEPROM_SIZE 512
#define CYCLE_TIME 1000

////////////////
/// APP INFO ///
////////////////

#define TIME_URL "http://worldtimeapi.org/api/ip"
#define TIME_ZONE "UTC"
#define TIME_OFFSET 0

/////////////////////
/// ERROR HANDLING ///
/////////////////////

#define MAX_RETRY_ATTEMPTS 3
#define ERROR_LOG_SIZE 50

////////////////
/// MANAGERS ///
////////////////

/// WIFI ///

#define SERVER_PORT 80
#define SSID_START_ADDR 0
#define PASSWORD_START_ADDR 100
#define WIFI_CONNECTION_TIMEOUT 30000  // milliseconds
#define WIFI_RECONNECT_INTERVAL 60000  // milliseconds

/// MQTT ///

#define MQTT_BROKER "192.168.1.8"  // MQTT Broker IP Address
#define MQTT_PORT 1883              // MQTT Broker Port
#define MQTT_USERNAME "user"
#define MQTT_PASSWORD "password"

#define MQTT_VERSION 5  // MQTT Protocol Version (e.g., 3.1, 3.1.1, 5)
#define MQTT_MAX_PACKET_SIZE 1024
#define MQTT_KEEP_ALIVE 60  // seconds
#define MQTT_SERVER_CONNECTION_TIMEOUT 10000  // milliseconds

#define MQTT_QOS_LEVEL 1
#define MQTT_RETAIN_MESSAGE false

#define MQTT_DATA_TOPIC "data"  // MQTT Data Topic
#define MQTT_COMMAND_TOPIC "command"  // MQTT Command Topic
#define MQTT_REGISTER_TOPIC "register"  // MQTT Register Topic

/// HARDWARE ///

#define LED_PIN D4
#define BUTTON_PIN D3
#define TRIGGER_PIN D6  // Trigger Pin (e.g., for ultrasonic sensor)
#define ECHO_PIN D7     // Echo Pin (e.g., for ultrasonic sensor)
#define TIMEOUT 25200   // Timeout value for hardware operations

#define ULTRASONIC_TIMEOUT 25200  // microseconds
#define DEBOUNCE_DELAY 50  // milliseconds

#define ADC_RESOLUTION 4096
#define VOLTAGE_REFERENCE 3.3  // volts

////////////////////
/// DATA LOGGING ///
////////////////////

#define LOG_RATE 10000  // milliseconds
#define MAX_LOG_ENTRIES 1000
#define LOG_FILE_PATH "/data_log.csv"

/////////////////////
/// ERROR HANDLING ///
/////////////////////

#define MAX_RETRY_ATTEMPTS 3
#define ERROR_LOG_SIZE 50

//////////////////////
/// POWER MANAGEMENT ///
//////////////////////

#define SLEEP_DURATION 3600000  // milliseconds (1 hour)
#define LOW_POWER_THRESHOLD 20  // percentage

////////////////////
/// OTA UPDATES ////
////////////////////

#define OTA_PORT 8080
#define OTA_PASSWORD "ota_secret"
#define FIRMWARE_VERSION_URL "https://example.com/firmware/version"
#define FIRMWARE_BINARY_URL "https://example.com/firmware/latest.bin"

#endif  // CONSTANTS_H
