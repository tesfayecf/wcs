#ifndef APP_H
#define APP_H

#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/AppConfig.h"
#include "../utils/types.h"

class App {
   public:
    App(const AppConfig& config);
    AppConfig appConfig;
    Managers managers;

    WifiManager* wifiManager_;
    MQTTManager* mqttManager_;
    HWManager* hwManager_;

   public:
    void setup();
    void loop();
    void stop();
    void restart();

    bool getWifiCredentials();
    void blink();
    unsigned sensorTime = 0;
};

#endif  // APP_H
