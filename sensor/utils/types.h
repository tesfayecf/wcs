#include "./../HWManager.h"
#include "./../MQTTManager.h"
#include "./../PumpManager.h"
#include "./../WebServerManager.h"
#include "./../WiFiManager.h"

struct Managers {
    WiFiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;
    WebServerManager* webServerManager;
    PumpManager* pumpManager;
};