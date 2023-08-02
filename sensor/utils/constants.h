#ifndef CONSTANTS_H
#define CONSTANTS_H

//////////////////
/// APP STATUS ///
//////////////////

#define DEBUG True

enum STATUS_CODE {
    WIFI_CONNECTED_,
    WIFI_DISCONNECTED_,

    MQTT_CONNECTED_,
    MQTT_DISCONNECTED_,
    MQTT_SUBSCRIBED_,
    MQTT_UNSUBSCRIBED_,

    SENSOR_CONNECTED_,
    SENSOR_DISCONNECTED_,
};

enum LOG_CODE {
    WIFI_CONNECTION,
    WIFI_DISCONNECTION,
    WIFI_CONNECTION_ATTEMPT,
    WIFI_CONNECTION_SUCCESS,
    WIFI_CONNECTION_FAILED,
    WIFI_CONNECTION_TIMEOUT,
    WIFI_CONNECTION_RETRY,
    WIFI_CONNECTION_RETRY_ATTEMPT,
    WIFI_CONNECTION_RETRY_SUCCESS,
    WIFI_CONNECTION_RETRY_FAILED,
    WIFI_CONNECTION_RETRY_TIMEOUT,

    MQTT_CONNECTION,
    MQTT_DISCONNECTION,
    MQTT_SUBSCRIBED,
    MQTT_UNSUBSCRIBED,
    MQTT_PUBLISHED,
    MQTT_SUBSCRIPTION_FAILED,
    MQTT_PUBLISH_FAILED,
    MQTT_MESSAGE_RECEIVED,
    MQTT_MESSAGE_PROCESSED,
    MQTT_MESSAGE_PROCESSING_FAILED,
    MQTT_MESSAGE_PROCESSING_SUCCESS,

    SENSOR_CONNECTED,
    SENSOR_DISCONNECTED,
    SENSOR_DATA_RECEIVED,
    SENSOR_DATA_PROCESSING_SUCCESS,
    SENSOR_DATA_PROCESSING_FAILED,
    SENSOR_DATA_PROCESSING_TIMEOUT,
    SENSOR_DATA_PROCESSING_RETRY,
};

///////////////////
/// CONNECTIONS ///
///////////////////

//  WIFI
#define WIFI_SSID "ONO1D77"
#define WIFI_PASSWORD "dVy68naGZU5d"
#define PUBLIC_IP "2.152.26.61"

// MQTT
#define MQTT_BROKER "192.168.1.13"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "esp8266"
#define MQTT_USERNAME ""
#define MQTT_PASSWORD ""

// HARDWARE
#define TRIGGER_PIN D5  // RX
#define ECHO_PIN D6     // TX
#define MAX_DISTANCE 450

// time request
#define __request_host__ \
    "http://worldtimeapi.org/api/timezone/Europe/Madrid"  //"api.timezonedb.com"
#define __request_port__ 443
#define __request_link__                                                    \
    "/v2.1/get-time-zone?key=QB787TC1SX9D&format=json&by=zone&zone=Europe/" \
    "Madrid"
#define __request_fingerprint__                                                \
    "6D 0E 3B 57 A2 26 D2 15 6C 62 AA 3F 0E CC F0 14 2C 70 6C 60 39 D4 50 B5 " \
    "44 9F 3D C7 6E 9F CB 22"

#define __local_port__ 8888
#define __ntp_packet_size__ 48
#define __ntp_server_name__ "pool.ntp.org"
#define __ntp_sync_interval__ 300
#define __ntp_wait_time__ 1500
#define __time_zone__ 1

#endif  // CONSTANTS_H
