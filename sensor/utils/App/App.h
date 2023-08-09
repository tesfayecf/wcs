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

    WiFiConnectionManager& wifiManager();
    MQTTConnectionManager& mqttManager();
    HWConnectionManager& hwManager();
    WebServerConnectionManager& webServerManager();

    AppConfig appConfig;

   private:
    WiFiConnectionManager* wifiManager_;
    MQTTConnectionManager* mqttManager_;
    HWConnectionManager* hwManager_;
    WebServerConnectionManager* webServerManager_;

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
