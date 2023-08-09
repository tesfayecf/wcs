#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H
#include <ESP8266WiFi.h>

class App;  // Forward declaration of App

class WiFiConnectionManager {
   private:
    App& appInstance;

   public:
    // Constructor
    WiFiConnectionManager(App& app);

    // Initialize WiFi connection
    void setup();

    void loop();

    // Check if WiFi is connected
    bool isConnected();

    // Get the WiFi connection status
    wl_status_t getStatus();

   private:
    boolean connect();
};

#include "WiFiConnectionManager.cpp"
#endif  // WIFI_CONNECTION_MANAGER_H
