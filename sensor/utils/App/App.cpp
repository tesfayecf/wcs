#include "App.h"

#include "../../connections/hardware-connection/HWConnectionManager.h"
#include "../../connections/mqtt-connection/MQTTConnectionManager.h"
#include "../../connections/webserver-connection/WebServerConnectionManager.h"
#include "../../connections/wifi-connection/WiFiConnectionManager.h"
#include "../AppConfig.h"

App::App(const AppConfig& config)
    : wifiManager_(nullptr),
      mqttManager_(nullptr),
      hwManager_(nullptr),
      webServerManager_(nullptr),
      appConfig(config) {}

void App::init() {
    wifiManager_ = new WiFiConnectionManager(*this);
    mqttManager_ = new MQTTConnectionManager(*this);
    hwManager_ = new HWConnectionManager(*this);
    webServerManager_ = new WebServerConnectionManager(*this);

    wifiManager_->init();
    mqttManager_->init();
    hwManager_->init();
    webServerManager_->init();
}

void App::loop() {
    wifiManager_->loop();
    mqttManager_->loop();
    hwManager_->loop();
    webServerManager_->loop();
}

WiFiConnectionManager& App::getWiFiManager() { return *wifiManager_; }

MQTTConnectionManager& App::getMQTTManager() { return *mqttManager_; }

HWConnectionManager& App::getHWManager() { return *hwManager_; }

WebServerConnectionManager& App::getWebServerManager() {
    return *webServerManager_;
}