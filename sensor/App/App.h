#ifndef APP_H
#define APP_H

class WiFiManager;
class MQTTManager;
class HWManager;
class WebServerManager;
class PumpManager;

#include "../utils/AppConfig.h"
#include "../utils/types.h"

class App {
   public:
    App(const AppConfig& config);
    AppConfig appConfig;
    Managers managers;

    WiFiManager* wifiManager_;
    MQTTManager* mqttManager_;
    HWManager* hwManager_;
    WebServerManager* webServerManager_;
    PumpManager* pumpManager_;

   public:
    void setup();
    void loop();
    void stop();
    void restart();

    void blink();
    unsigned sensorTime = 0;
};

#endif  // APP_H
