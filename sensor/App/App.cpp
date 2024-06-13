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
#include "../misc/logger.h"
#include "./AppConfig.h"

App::App(const AppConfig &config) :
    wifiManager(nullptr), mqttManager(nullptr), hwManager(nullptr), appConfig(config) {
}

void App::setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);

    // Initialize logger
    Logger::setLogLevel(VERBOSE);
    Logger::notice("App::setup()", "App initialized");

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
    Logger::notice("App::setup()", "App set up finished");
}

void App::loop() {
    static unsigned long lastMillis = 0;
    unsigned long currentMillis = millis();
    if (currentMillis - lastMillis >= CYCLE_TIME) {
        lastMillis = currentMillis;

        // Update time
        this->appConfig.appInfo.localTime = currentMillis;
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
    Logger::verbose("App::setBoardInfo()", "Board Chip Id: " + String(this->appConfig.boardInfo.boardChipId));
    this->appConfig.boardInfo.boardFlashChipId = ESP.getFlashChipId();
    Logger::verbose("App::setBoardInfo()", "Board Flash Chip Id: " + String(this->appConfig.boardInfo.boardFlashChipId));
    this->appConfig.boardInfo.boardCoreVersion = ESP.getCoreVersion();
    Logger::verbose("App::setBoardInfo()", "Board Core Version: " + String(this->appConfig.boardInfo.boardCoreVersion));
    this->appConfig.boardInfo.boardFlashChipSize = ESP.getFlashChipSize();
    Logger::verbose("App::setBoardInfo()", "Board Flash Chip Size: " + String(this->appConfig.boardInfo.boardFlashChipSize));
    this->appConfig.boardInfo.boardFlashChipRealSize = ESP.getFlashChipRealSize();
    Logger::verbose("App::setBoardInfo()", "Board Flash Chip Real Size: " + String(this->appConfig.boardInfo.boardFlashChipRealSize));
    this->appConfig.boardInfo.boardCpuFreqMHz = ESP.getCpuFreqMHz();
    Logger::verbose("App::setBoardInfo()", "Board Cpu Freq MHz: " + String(this->appConfig.boardInfo.boardCpuFreqMHz));
    this->appConfig.boardInfo.boardFreeHeap = ESP.getFreeHeap();
    Logger::verbose("App::setBoardInfo()", "Board Free Heap: " + String(this->appConfig.boardInfo.boardFreeHeap));
    this->appConfig.boardInfo.boardHeapFragmentation = ESP.getHeapFragmentation();
    Logger::verbose("App::setBoardInfo()", "Board Heap Fragmentation: " + String(this->appConfig.boardInfo.boardHeapFragmentation));
    this->appConfig.boardInfo.boardSketchSize = ESP.getSketchSize();
    Logger::verbose("App::setBoardInfo()", "Board Sketch Size: " + String(this->appConfig.boardInfo.boardSketchSize));
    this->appConfig.boardInfo.boardFreeSketchSpace = ESP.getFreeSketchSpace();
    Logger::verbose("App::setBoardInfo()", "Board Free Sketch Space: " + String(this->appConfig.boardInfo.boardFreeSketchSpace));
    this->appConfig.boardInfo.boardSketchMD5 = ESP.getSketchMD5();
    Logger::verbose("App::setBoardInfo()", "Board Sketch MD5: " + String(this->appConfig.boardInfo.boardSketchMD5));
    this->appConfig.boardInfo.boardFlashChipSpeed = ESP.getFlashChipSpeed();
    Logger::verbose("App::setBoardInfo()", "Board Flash Chip Speed: " + String(this->appConfig.boardInfo.boardFlashChipSpeed));
    this->appConfig.boardInfo.boardCycleCount = ESP.getCycleCount();
    Logger::verbose("App::setBoardInfo()", "Board Cycle Count: " + String(this->appConfig.boardInfo.boardCycleCount));
}

void App::setAppInfo() {
    // Get flash chip id
    String flashChipIdStr = String(this->appConfig.boardInfo.boardFlashChipId, DEC);
    // Get board chip id
    String boardChipIdStr = this->appConfig.boardInfo.boardChipId;
    // Generate board id
    this->appConfig.appInfo.sensorId = generateId(boardChipIdStr, flashChipIdStr);
    Logger::verbose("App::setAppInfo()", "Sensor Id: " + this->appConfig.appInfo.sensorId);

    // Initialize sensor time
    setTime(this->appConfig.appInfo.startTime);
    Logger::verbose("App::setAppInfo()", "Sensor time initialized");
}