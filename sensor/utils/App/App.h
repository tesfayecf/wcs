#ifndef APP_H
#define APP_H

class WiFiConnectionManager;
class MQTTConnectionManager;
class HWConnectionManager;
class WebServerConnectionManager;

#include "../AppConfig.h"

class App {
   public:
    App(const AppConfig& config);
    void init();
    void loop();

    WiFiConnectionManager& getWiFiManager();
    MQTTConnectionManager& getMQTTManager();
    HWConnectionManager& getHWManager();
    WebServerConnectionManager& getWebServerManager();

   private:
    WiFiConnectionManager* wifiManager_;
    MQTTConnectionManager* mqttManager_;
    HWConnectionManager* hwManager_;
    WebServerConnectionManager* webServerManager_;

    AppConfig appConfig;
};

#include "App.cpp"
#endif  // APP_H
