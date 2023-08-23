#ifndef TYPES_H
#define TYPES_H

class WifiManager;
class MQTTManager;
class HWManager;

struct Managers {
    WifiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;
};

#endif  // TYPES_H
