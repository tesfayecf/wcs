#ifndef APP_H
#define APP_H

class WiFiManager;
class MQTTManager;
class HWManager;
class WebServerManager;

#include "../AppConfig.h"

class App {
   public:
    App(const AppConfig& config);

    WiFiManager& wifiManager();
    MQTTManager& mqttManager();
    HWManager& hwManager();
    WebServerManager& webServerManager();

    AppConfig appConfig;

   private:
    WiFiManager* wifiManager_;
    MQTTManager* mqttManager_;
    HWManager* hwManager_;
    WebServerManager* webServerManager_;

   public:
    void setup();
    void loop();
    void stop();
    void restart();

    bool getWifiCredentials();
    unsigned sensorTime = 0;
};

#include "App.cpp"
#endif  // APP_H
