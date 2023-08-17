#ifndef TYPES_H
#define TYPES_H

class WiFiManager;
class MQTTManager;
class HWManager;

struct Managers {
    WiFiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;
};

#endif  // TYPES_H
