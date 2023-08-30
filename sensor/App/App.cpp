#include "App.h"

#include <EEPROM.h>

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/pump-manager/PumpManager.cpp"
#include "../../managers/pump-manager/PumpManager.h"
#include "../../managers/webserver-manager/WebServerManager.cpp"
#include "../../managers/webserver-manager/WebServerManager.h"
#include "../../managers/wifi-manager/WiFiManager.cpp"
#include "../../managers/wifi-manager/WiFiManager.h"
#include "../utils/AppConfig.h"
#include "../utils/constants.h"
#include "../utils/types.h"

App::App(const AppConfig& config)
    : wifiManager_(nullptr),
      mqttManager_(nullptr),
      hwManager_(nullptr),
      webServerManager_(nullptr),
      pumpManager_(nullptr),
      appConfig(config) {
    managers.wifiManager = wifiManager_;
    managers.mqttManager = mqttManager_;
    managers.hwManager = hwManager_;
    managers.webServerManager = webServerManager_;
    managers.pumpManager = pumpManager_;
}

void App::setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);

    wifiManager_ = new WiFiManager();
    mqttManager_ = new MQTTManager();
    hwManager_ = new HWManager();
    webServerManager_ = new WebServerManager();
    pumpManager_ = new PumpManager();

    wifiManager_->init(&appConfig, &this->managers);
    // mqttManager_->init(&this->appConfig, &this->managers);
    hwManager_->init(&this->appConfig, &this->managers);
    webServerManager_->init(&this->appConfig, &this->managers);
    pumpManager_->init(&this->appConfig, &this->managers);

    wifiManager_->setup();
    blink();

    // mqttManager_->setup();
    blink();

    hwManager_->setup();

    webServerManager_->setup();
    blink();

    pumpManager_->setup();
    blink();

    digitalWrite(LED_BUILTIN, LOW);
}
void App::loop() {
    sensorTime = millis();

    // // Send sensor readings every minute pass to manager
    // if (sensorTime % 10000 == 0) {
    //     // Get sensor data
    //     unsigned int value = hwManager_->getDistance();
    //     // Convert data to cm
    //     float distance = hwManager_->convertToCm(value);
    //     // Publish data
    //     mqttManager_->publishReadings(value, distance);
    // }

    if (sensorTime % 1000 == 0) {
        wifiManager_->loop();  // check wifi connection
        // mqttManager_->loop();       // check mqtt messages
        hwManager_->loop();  // check hardware connection
    }

    if (sensorTime % 1000 == 0) {
        webServerManager_->loop();
    }

    if (sensorTime % 100 == 0) {
        pumpManager_->loop();
    }
}

void App::stop() {}
void App::restart() {}

void App::blink() {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
}