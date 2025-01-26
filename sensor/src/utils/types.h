#ifndef TYPES_H
#define TYPES_H

enum LogLevel {
  VERBOSE = 0,
  NOTICE,
  WARNING,
  ERROR,
  FATAL,
  SILENT
};

/// @brief Enumeration for WiFi connection states
/// @details This enumeration defines the different states that a WiFi connection can be in.
///          It is used to track the state of the WiFi connection and provide appropriate
///          feedback to the user or system.
enum class ConnectionStatus {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    FAILED
};


/// @brief Enumeration for WiFi connection states
/// @details This enumeration defines the different states that a WiFi connection can be in.
///          It is used to track the state of the WiFi connection and provide appropriate
///          feedback to the user or system.
enum class WiFiConnectionState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    CONFIG_PORTAL
};

/// @brief Enumeration for MQTT connection states
/// @details This enumeration defines the different states that an MQTT connection can be in.
///          It is used to track the state of the MQTT connection and provide appropriate
///          feedback to the user or system.
enum class MQTTConnectionState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    SUBSCRIBING,
    PUBLISHING
};

#endif // TYPES_H