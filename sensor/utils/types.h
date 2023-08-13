#ifndef TYPES_H
#define TYPES_H

class WiFiManager;
class MQTTManager;
class HWManager;
class WebServerManager;
class PumpManager;

struct Managers {
    WiFiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;
    WebServerManager* webServerManager;
    PumpManager* pumpManager;
};

#endif  // TYPES_H
