#ifndef CONSTANTS_H
#define CONSTANTS_H

//////////////////
/// APP STATUS ///
//////////////////

#define DEBUG True

// enum STATUS_CODE {
//     WIFI_CONNECTED_,
//     WIFI_DISCONNECTED_,

//     MQTT_CONNECTED_,
//     MQTT_DISCONNECTED_,
//     MQTT_SUBSCRIBED_,
//     MQTT_UNSUBSCRIBED_,

//     SENSOR_CONNECTED_,
//     SENSOR_DISCONNECTED_,
// };

// enum LOG_CODE {
//     WIFI_CONNECTION,
//     WIFI_DISCONNECTION,
//     WIFI_CONNECTION_ATTEMPT,
//     WIFI_CONNECTION_SUCCESS,
//     WIFI_CONNECTION_FAILED,
//     WIFI_CONNECTION_TIMEOUT,
//     WIFI_CONNECTION_RETRY,
//     WIFI_CONNECTION_RETRY_ATTEMPT,
//     WIFI_CONNECTION_RETRY_SUCCESS,
//     WIFI_CONNECTION_RETRY_FAILED,
//     WIFI_CONNECTION_RETRY_TIMEOUT,

//     MQTT_CONNECTION,
//     MQTT_DISCONNECTION,
//     MQTT_SUBSCRIBED,
//     MQTT_UNSUBSCRIBED,
//     MQTT_PUBLISHED,
//     MQTT_SUBSCRIPTION_FAILED,
//     MQTT_PUBLISH_FAILED,
//     MQTT_MESSAGE_RECEIVED,
//     MQTT_MESSAGE_PROCESSED,
//     MQTT_MESSAGE_PROCESSING_FAILED,
//     MQTT_MESSAGE_PROCESSING_SUCCESS,

//     SENSOR_CONNECTED,
//     SENSOR_DISCONNECTED,
//     SENSOR_DATA_RECEIVED,
//     SENSOR_DATA_PROCESSING_SUCCESS,
//     SENSOR_DATA_PROCESSING_FAILED,
//     SENSOR_DATA_PROCESSING_TIMEOUT,
//     SENSOR_DATA_PROCESSING_RETRY,
// };

//////////////////
/// APP CONFIG ///
//////////////////

#define APP_NAME "Sensor"
#define APP_VERSION "0.1"

#define EEPROM_SIZE 512

/// MANAGERS ///

////////////////////
/// WIFI MANAGER ///
////////////////////

// #define WIFI_SSID ""
// #define WIFI_PASSWORD ""

#define SERVER_PORT 80
#define SSID_START_ADDR 0
#define PASSWORD_START_ADDR 100
#define WIFI_CONNECTION_TIMEOUT 250

////////////////////
/// MQTT MANAGER ///
////////////////////

#define MQTT_BROKER "192.168.1.2"  // MQTT Broker IP Address
#define MQTT_PORT 1883             // MQTT Broker Port

#define MQTT_VERSION 5  // MQTT Protocol Version (e.g., 3.1, 3.1.1, 5)
#define MQTT_MAX_PACKET_SIZE 1024
#define MQTT_KEEP_ALIVE 60
#define MQTT_CONNECTION_TIMEOUT 10

#define MQTT_STATUS_TOPIC "status"             // MQTT Status Topic
#define MQTT_CONFIG_TOPIC "config"             // MQTT Config Topic
#define MQTT_DATA_TOPIC "data"                 // MQTT Data Topic
#define MQTT_AUTH_TOPIC "auth"                 // MQTT Auth Topic
#define MQTT_REGISTER_TOPIC "server/register"  // MQTT Register Topic

////////////////////////
/// HARDWARE MANAGER ///
////////////////////////

#define TRIGGER_PIN D6  // Trigger Pin (e.g., for ultrasonic sensor)
#define ECHO_PIN D7     // Echo Pin (e.g., for ultrasonic sensor)
#define TIMEOUT 25200   // Timeout value for hardware operations

#endif  // CONSTANTS_H
