#include "App.h"

#include <EEPROM.h>

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

WiFiConnectionManager& App::wifiManager() { return *wifiManager_; }

MQTTConnectionManager& App::mqttManager() { return *mqttManager_; }

HWConnectionManager& App::hwManager() { return *hwManager_; }

WebServerConnectionManager& App::webServerManager() {
    return *webServerManager_;
}

void App::setup() {
    wifiManager_ = new WiFiConnectionManager(*this);
    mqttManager_ = new MQTTConnectionManager(*this);
    hwManager_ = new HWConnectionManager(*this);
    webServerManager_ = new WebServerConnectionManager(*this);

    wifiManager_->setup();
    mqttManager_->setup();
    hwManager_->setup();
}
void App::loop() {
    sensorTime = millis();

    // Send sensor readings every minute
    if (sensorTime % 10000 == 0) {
        // Get sensor data
        unsigned int value = hwManager_->getDistance();
        // Convert data to cm
        float distance = hwManager_->convertToCm(value);
        // Publish data
        mqttManager_->publishReadings(value, distance);
    }

    if (sensorTime % 1000 == 0) {
        wifiManager_->loop();       // check wifi connection
        mqttManager_->loop();       // check mqtt messages
        hwManager_->loop();         // check hardware connection
        webServerManager_->loop();  // check webserver requests
    }
}

void App::stop() {}
void App::restart() {}

bool App::getWifiCredentials() {
    String ssid;
    for (int i = 0; i < 32; ++i) {
        ssid += char(EEPROM.read(i));
    }
    Serial.println();
    Serial.print("SSID: ");
    Serial.println(ssid);
    Serial.println("Reading EEPROM pass");

    String password = "";
    for (int i = 32; i < 96; ++i) {
        password += char(EEPROM.read(i));
    }
    Serial.print("PASS: ");
    Serial.println(password);

    if (ssid.length() > 0 && password.length() > 0) {
        Serial.println("Found wifi credentials");
        return true;
    } else {
        Serial.println("Wifi credentials not found");
        return false;
    }
}