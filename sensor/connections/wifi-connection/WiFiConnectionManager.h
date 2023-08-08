#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H
#include <ESP8266WiFi.h>

#include "../../utils/App/App.h"
class App;  // Forward declaration of App

class WiFiConnectionManager {
   private:
    App& appInstance;

   public:
    // Constructor
    WiFiConnectionManager(App& app);

    // Initialize WiFi connection
    void init();

    void loop();

    boolean connect();

    // Check if WiFi is connected
    bool isConnected();

    // Get the WiFi connection status
    wl_status_t getStatus();
};

#include "WiFiConnectionManager.cpp"
#endif  // WIFI_CONNECTION_MANAGER_H
