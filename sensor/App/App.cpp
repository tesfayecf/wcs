#include "App.h"

#include <TimeLib.h>

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/hardware-manager/Sensor.cpp"
#include "../../managers/hardware-manager/Sensor.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.cpp"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/constants.h"
#include "../utils/types.h"
#include "../utils/utils.h"
#include "./AppConfig.h"

App::App(const AppConfig &config)
    : wifiManager_(nullptr), mqttManager_(nullptr), hwManager_(nullptr), appConfig(config) {
    managers.wifiManager = wifiManager_;
    managers.mqttManager = mqttManager_;
    managers.hwManager = hwManager_;
}

void App::setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);

    // Set App info
    this->setBoardInfo();
    // Set Board info
    this->setAppInfo();

    wifiManager_ = new WifiManager();
    mqttManager_ = new MQTTManager();
    hwManager_ = new HWManager();

    wifiManager_->init(&this->appConfig, &this->managers);
    mqttManager_->init(&this->appConfig, &this->managers);
    hwManager_->init(&this->appConfig, &this->managers);

    wifiManager_->setup();
    blink();

    mqttManager_->setup();
    blink();

    hwManager_->setup();
    blink();

    // getTimeStamp(this->appConfig);
    setTime(this->appConfig.appInfo.startTime);

    digitalWrite(LED_BUILTIN, LOW);
}

void App::loop() {
    if (millis() % 1000 == 0) {
        // Update time
        this->appConfig.appInfo.localTime = millis();
        this->appConfig.appInfo.serverTime = now();

        wifiManager_->loop(); // check wifi connection
        mqttManager_->loop(); // check mqtt messages
        hwManager_->loop();   // check hardware connection
    }
}

void App::stop() {
}

void App::restart() {
    ESP.restart();
}

void App::setBoardInfo() {
    this->appConfig.boardInfo.boardChipId = ESP.getChipId();
    this->appConfig.boardInfo.boardFlashChipId = ESP.getFlashChipId();
    this->appConfig.boardInfo.boardCoreVersion = ESP.getCoreVersion();
    this->appConfig.boardInfo.boardFlashChipSize = ESP.getFlashChipSize();
    this->appConfig.boardInfo.boardFlashChipRealSize = ESP.getFlashChipRealSize();
    this->appConfig.boardInfo.boardCpuFreqMHz = ESP.getCpuFreqMHz();
    this->appConfig.boardInfo.boardFreeHeap = ESP.getFreeHeap();
    this->appConfig.boardInfo.boardHeapFragmentation = ESP.getHeapFragmentation();
    this->appConfig.boardInfo.boardSketchSize = ESP.getSketchSize();
    this->appConfig.boardInfo.boardFreeSketchSpace = ESP.getFreeSketchSpace();
    this->appConfig.boardInfo.boardSketchMD5 = ESP.getSketchMD5();
    this->appConfig.boardInfo.boardFlashChipSpeed = ESP.getFlashChipSpeed();
    this->appConfig.boardInfo.boardCycleCount = ESP.getCycleCount();
}

void App::setAppInfo() {
    // Get flash chip id
    String flashChipIdStr = String(this->appConfig.boardInfo.boardFlashChipId, DEC);
    // Get id
    this->appConfig.appInfo.sensorId = generateId(this->appConfig.boardInfo.boardChipId, flashChipIdStr);
}