// // E8:9F:6D:93:59:B3 wemos d1 r2 base64: RTg6OUY6NkQ6OTM6NTk6QjM=
// // 48:55:19:C8:87:7A wemos d1 mini base64: NDg6NTU6MTk6Qzg6ODc6N0E=

#include <EEPROM.h>

#include "HWManager.h"
#include "MQTTManager.h"
#include "PumpManager.h"
#include "WebServerManager.h"
#include "WiFiManager.h"
#include "utils/AppConfig.h"
#include "utils/types.h"

// App config
AppConfig appConfig;

unsigned sensorTime = 0;

WiFiManager wifiManager;
MQTTManager mqttManager;
HWManager hwManager;
WebServerManager webServerManager;
PumpManager pumpManager;

void setup() {
    Serial.begin(115200);

    // App managers
    Managers managers = {&wifiManager, &mqttManager, &hwManager,
                         &webServerManager, &pumpManager};

    wifiManager.init(&appConfig, &managers);
    // mqttManager.init();
    // hwManager.init();
    // webServerManager.init();
    // pumpManager.init();

    wifiManager.setup();
    // mqttManager.setup();
    hwManager.setup();
    webServerManager.setup();
    pumpManager.setup();
}

void loop() {
    sensorTime = millis();

    // // Send sensor readings every minute
    // if (sensorTime % 10000 == 0) {
    //     // Get sensor data
    //     unsigned int value = hwManager_->getDistance();
    //     // Convert data to cm
    //     float distance = hwManager_->convertToCm(value);
    //     // Publish data
    //     mqttManager_->publishReadings(value, distance);
    // }

    if (sensorTime % 1000 == 0) {
        wifiManager.loop();  // check wifi connection
        // mqttManager.loop();       // check mqtt messages
        hwManager.loop();  // check hardware connection
    }

    if (sensorTime % 1000 == 0) {
        webServerManager.loop();  // check webserver requests
    }

    if (sensorTime % 100 == 0) {
        pumpManager.loop();
    }
}