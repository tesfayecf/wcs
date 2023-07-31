#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H

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

#include "WiFiConnectionManager.cpp"
#endif  // WIFI_CONNECTION_MANAGER_H
