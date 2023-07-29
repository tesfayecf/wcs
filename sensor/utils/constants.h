#ifndef constants
#define constants

// wifi
#define WIFI_SSID "ONO1D77"
#define WIFI_PASSWORDS "dVy68naGZU5d"
#define PUBLIC_IP "2.152.26.61"

// MQTT
#define MQTT_BROKER = "192.168.1.13"
#define MQTT_PORT = 1883
#define MQTT_USERNAME = ""
#define MQTT_PASSWORD = ""

// time request
#define __request_host__ "http://worldtimeapi.org/api/timezone/Europe/Madrid" //"api.timezonedb.com"
#define __request_port__ 443
#define __request_link__ "/v2.1/get-time-zone?key=QB787TC1SX9D&format=json&by=zone&zone=Europe/Madrid"
#define __request_fingerprint__ "6D 0E 3B 57 A2 26 D2 15 6C 62 AA 3F 0E CC F0 14 2C 70 6C 60 39 D4 50 B5 44 9F 3D C7 6E 9F CB 22"

#define __local_port__ 8888
#define __ntp_packet_size__ 48
#define __ntp_server_name__ "pool.ntp.org"
#define __ntp_sync_interval__ 300
#define __ntp_wait_time__ 1500
#define __time_zone__ 1

// web credentials
#define __web_username__ "admin"
#define __web_password__ "superuser"
#define __pump_password__ "boscal22boscal22"
#define __download_password__ "ABcd1234ABcd1234"

enum logCodes
{
    ARDUINO_STARTED,
    DIRECTORY_STARTED,
    WIFI_CONNECTED,
    WIFI_CONNECT_ERROR,
    SERVER_STARTED,
    NEW_CLIENT,
    WEBSOCKET_STARTED,
    WS_NEW_CLIENT_CONNECTED,
    WEBSOCKET_ERROR,
    WS_CLIENT_DISCONNECTED,
    SENSOR_STARTED,
    GRAPH_UPDATE_REQUEST,
    GRAPH_UPDATE_REQUEST_ERROR,
    PUMP_START_REQUEST,
    PUMP_START_SUCCES,
    PUMP_START_ERROR,
    PUMP_STOP_REQUEST,
    PUMP_STOP_SUCCES,
    PUMP_STOP_ERROR,
    DOWNLOAD_LOGFILE_REQUEST,
    DOWNLOAD_LOGFILE_SUCCES,
    DOWNLOAD_LOGFILE_ERROR,
    DOWNLOAD_GRAPH_DATA_FILE_REQUEST,
    DOWNLOAD_GRAPH_DATA_FILE_SUCCES,
    DOWNLOAD_GRAPH_DATA_FILE_ERROR
};

#endif
