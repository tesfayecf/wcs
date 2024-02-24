from enum import Enum

class TOPICS():
    REGISTER_TOPIC = "server/register"
    DATA_TOPIC = "data"
    STATUS_TOPIC = "status"
    CONFIG_TOPIC = "config"
    AUTH_TOPIC = "auth"

class JSON_KEYS(Enum):
    # Wifi status
    WIFI_INITIALIZED = 101
    WIFI_CONNECTED_ = 102
    WIFI_CONNECTING = 103
    WIFI_DISCONNECTING = 104
    WIFI_HAS_ERROR = 105
    WIFI_ERROR = 106
    WIFI_STATUS = 107

    # Mqtt status
    MQTT_INITIALIZED = 201
    MQTT_CONNECTED_ = 202
    MQTT_CONNECTING = 203
    MQTT_DISCONNECTING = 204
    MQTT_HAS_ERROR = 205
    MQTT_ERROR = 206
    MQTT_STATUS = 207

    # Hardware status
    HW_INITIALIZED = 301
    HW_CONNECTED = 302
    HW_CONNECTING = 303
    HW_DISCONNECTING = 304
    HW_HAS_ERROR = 305
    HW_ERROR = 306
    HW_STATUS = 307

    # Sensor meta
    SENSOR_ID = 401
    SENSOR_TIME = 402

    # Board meta
    BOARD_UPTIME = 501
    BOARD_CHIP_ID = 502
    BOARD_FLASH_CHIP_ID = 503
    BOARD_VERSION = 504
    BOARD_FREE_RAM = 505
    BOARD_CPU_FREQ_MHZ = 506

    # Wifi meta
    BOARD_WIFI_SSID = 601
    BOARD_WIFI_HOSTNAME = 602
    BOARD_WIFI_GATEWAY = 603
    BOARD_WIFI_SUBNET = 604
    BOARD_WIFI_MAC = 605
    BOARD_WIFI_RSSI = 606
    BOARD_WIFI_CHANNEL = 607
    BOARD_WIFI_ENCRYPTION = 608

    # Sensor readings
    READING_RAW = 701
    READING_CM = 702

    # Log info
    TIMESTAMP = 801
    MESSAGE = 802

    # Authentication
    PUBLIC_KEY = 901
    G_PUBLIC_KEY = 902
    N_PUBLIC_KEY = 903

class MESSAGE_TYPES(Enum):
  # Status
  NOK = 0,
  OK = 1,

  # Commands
  AUTH = 2,
  REGISTER = 3,
  CONFIG = 4,
  START = 5,
  STOP = 6,
  RESET = 7,
  PING = 8,
  STATUS = 9,
  LOG = 10,
  INFO = 12,
  WARN = 13,
  ERROR = 14,


def ETS(key):
    # Mapping of enum values to their string representations
    enum_mapping = {
        # Wifi status
        JSON_KEYS.WIFI_INITIALIZED: "101",
        JSON_KEYS.WIFI_CONNECTED_: "102",
        JSON_KEYS.WIFI_CONNECTING: "103",
        JSON_KEYS.WIFI_DISCONNECTING: "104",
        JSON_KEYS.WIFI_HAS_ERROR: "105",
        JSON_KEYS.WIFI_ERROR: "106",
        JSON_KEYS.WIFI_STATUS: "107",

        # Mqtt status
        JSON_KEYS.MQTT_INITIALIZED: "201",
        JSON_KEYS.MQTT_CONNECTED_: "202",
        JSON_KEYS.MQTT_CONNECTING: "203",
        JSON_KEYS.MQTT_DISCONNECTING: "204",
        JSON_KEYS.MQTT_HAS_ERROR: "205",
        JSON_KEYS.MQTT_ERROR: "206",
        JSON_KEYS.MQTT_STATUS: "207",

        # Hardware status
        JSON_KEYS.HW_INITIALIZED: "301",
        JSON_KEYS.HW_CONNECTED: "302",
        JSON_KEYS.HW_CONNECTING: "303",
        JSON_KEYS.HW_DISCONNECTING: "304",
        JSON_KEYS.HW_HAS_ERROR: "305",
        JSON_KEYS.HW_ERROR: "306",
        JSON_KEYS.HW_STATUS: "307",

        # Sensor meta
        JSON_KEYS.SENSOR_ID: "401",
        JSON_KEYS.SENSOR_TIME: "402",

        # Board meta
        JSON_KEYS.BOARD_UPTIME: "501",
        JSON_KEYS.BOARD_CHIP_ID: "502",
        JSON_KEYS.BOARD_FLASH_CHIP_ID: "503",
        JSON_KEYS.BOARD_VERSION: "504",
        JSON_KEYS.BOARD_FREE_RAM: "505",
        JSON_KEYS.BOARD_CPU_FREQ_MHZ: "506",

        # Wifi meta
        JSON_KEYS.BOARD_WIFI_SSID: "601",
        JSON_KEYS.BOARD_WIFI_HOSTNAME: "602",
        JSON_KEYS.BOARD_WIFI_GATEWAY: "603",
        JSON_KEYS.BOARD_WIFI_SUBNET: "604",
        JSON_KEYS.BOARD_WIFI_MAC: "605",
        JSON_KEYS.BOARD_WIFI_RSSI: "606",
        JSON_KEYS.BOARD_WIFI_CHANNEL: "607",
        JSON_KEYS.BOARD_WIFI_ENCRYPTION: "608",

        # Sensor readings
        JSON_KEYS.READING_RAW: "701",
        JSON_KEYS.READING_CM: "702",

        # Log info
        JSON_KEYS.TIMESTAMP: "801",
        JSON_KEYS.MESSAGE: "802",

        # Authentication
        JSON_KEYS.PUBLIC_KEY: "901",
        JSON_KEYS.G_PUBLIC_KEY: "902",
        JSON_KEYS.N_PUBLIC_KEY: "903",
    }

    return enum_mapping.get(key, "0")
