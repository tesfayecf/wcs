#include "App.h"

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.cpp"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/AppConfig.h"
#include "../utils/constants.h"
#include "../utils/types.h"

App::App(const AppConfig& config)
    : wifiManager_(nullptr),
      mqttManager_(nullptr),
      hwManager_(nullptr),
      appConfig(config) {
  managers.wifiManager = wifiManager_;
  managers.mqttManager = mqttManager_;
  managers.hwManager = hwManager_;
}

void App::setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  this->setBoardInfo();
  this->setSensorId();

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

  digitalWrite(LED_BUILTIN, LOW);
}

void App::loop() {
  if (millis() % 1000 == 0) {
    wifiManager_->loop();  // check wifi connection
    mqttManager_->loop();  // check mqtt messages
    hwManager_->loop();    // check hardware connection
  }
}

void App::stop() {}
void App::restart() { ESP.restart(); }

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

  Serial.println("Board info saved");
}

void App::setSensorId() {
  this->appConfig.appInfo.sensorId = generateSensorID();
}

String App::generateSensorID() {
  String uniqueString = String(this->appConfig.boardInfo.boardChipId) +
                        String(this->appConfig.boardInfo.boardFlashChipId);
  MD5Builder md5;
  md5.begin();
  md5.add(uniqueString);
  md5.calculate();
  String md5Hash = md5.toString();
  return md5Hash;
}

void App::blink() {
  digitalWrite(LED_BUILTIN, LOW);
  delay(100);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
}