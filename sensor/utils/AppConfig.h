#ifndef APPCONFIG_H
#define APPCONFIG_H

#include "constants.h"

class AppConfig {
   public:
    class WiFiManager {
       public:
        const char* getSSID() const { return WIFI_SSID; }

        const char* getPassword() const { return WIFI_PASSWORD; }
    };

    class MQTTManager {
       public:
        const char* getBroker() const { return MQTT_BROKER; }

        int getPort() const { return MQTT_PORT; }

        const char* getClientID() const { return MQTT_CLIENT_ID; }

        const char* getUsername() const { return MQTT_USERNAME; }

        const char* getPassword() const { return MQTT_PASSWORD; }
    };

    class HardwareManager {
       public:
        int getTriggerPin() const { return TRIGGER_PIN; }

        int getEchoPin() const { return ECHO_PIN; }

        int getMaxDistance() const { return MAX_DISTANCE; }
    };

    class WebServerManager {
       public:
    };

    WiFiManager WiFi;
    MQTTManager MQTT;
    HardwareManager Hardware;
    WebServerManager WebServer;

    // Define other manager instances or getter methods as needed

    // You can also add time-related constants and getters here
};

#endif  // APPCONFIG_H
