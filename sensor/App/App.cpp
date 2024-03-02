#include "App.h"

#include <TimeLib.h>

#include "../managers/BaseManager.cpp" // BUG ALERT
#include "../managers/BaseManager.h"

#include "../../managers/hardware-manager/HWManager.cpp"  // BUG ALERT
#include "../../managers/hardware-manager/HWManager.h"

#include "../../managers/mqtt-manager/MQTTManager.cpp"  // BUG ALERT
#include "../../managers/mqtt-manager/MQTTManager.h"

#include "../../managers/wifi-manager/WifiManager.cpp"  // BUG ALERT
#include "../../managers/wifi-manager/WifiManager.h"

#include "../../managers/hardware-manager/Sensor.cpp"  // BUG ALERT
#include "../../managers/hardware-manager/Sensor.h"

#include "../../managers/mqtt-manager/JsonBuilder.cpp"  // BUG ALERT
#include "../../managers/mqtt-manager/JsonBuilder.h"

#include "../utils/constants.h"
#include "../utils/types.h"
#include "../utils/utils.h"
#include "./AppConfig.h"

App::App(const AppConfig &config) :
    wifiManager(nullptr), mqttManager(nullptr), hwManager(nullptr), appConfig(config) {
}

void App::setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);

    // Set App info
    this->setBoardInfo();
    // Set Board info
    this->setAppInfo();

    // Create managers
    wifiManager = new WifiManager();
    mqttManager = new MQTTManager();
    hwManager = new HWManager();

    // Initialize managers
    wifiManager->init_(this, &this->appConfig);
    mqttManager->init_(this, &this->appConfig);
    hwManager->init_(this, &this->appConfig);

    // Set up managers
    wifiManager->setup_();
    mqttManager->setup_();
    hwManager->setup_();

    blink();
    digitalWrite(LED_BUILTIN, LOW);
}

void App::loop() {
    if (millis() % CYCLE_TIME == 0) {
        // Update time
        this->appConfig.appInfo.localTime = millis();
        this->appConfig.appInfo.serverTime = now();

        // Loop managers
        wifiManager->loop_(); // Check wifi connection
        mqttManager->loop_(); // Check mqtt messages
        hwManager->loop_();   // Check hardware connection
    }
}

void App::stop() { }

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
    // Get board chip id
    String boardChipIdStr = this->appConfig.boardInfo.boardChipId;
    // Generate board id
    this->appConfig.appInfo.sensorId = generateId(boardChipIdStr, flashChipIdStr);

    // Initialize sensor time
    setTime(this->appConfig.appInfo.startTime);
}