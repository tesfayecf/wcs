#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H

#include <ESP8266WiFi.h>

class WiFiConnectionManager {
   public:
    // Constructor
    WiFiConnectionManager();

    // Initialize WiFi connection
    void init();

    // Check if WiFi is connected
    bool isConnected();

    // Get the WiFi connection status
    wl_status_t getStatus();
};

#endif  // WIFI_CONNECTION_MANAGER_H
