#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H
#include <ESP8266WiFi.h>

#include "../../utils/AppConfig.h"
#include "../../utils/types.h"
#include "Arduino.h"

class WiFiManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

   public:
    // Constructor
    WiFiManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

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

#endif  // WIFI_CONNECTION_MANAGER_H