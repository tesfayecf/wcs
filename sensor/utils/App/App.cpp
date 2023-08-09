#include "App.h"

#include <EEPROM.h>

#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/webserver-manager/WebServerManager.h"
#include "../../managers/wifi-manager/WiFiManager.h"
#include "../AppConfig.h"

App::App(const AppConfig& config)
    : wifiManager_(nullptr),
      mqttManager_(nullptr),
      hwManager_(nullptr),
      webServerManager_(nullptr),
      appConfig(config) {}

WiFiManager& App::wifiManager() { return *wifiManager_; }

MQTTManager& App::mqttManager() { return *mqttManager_; }

HWManager& App::hwManager() { return *hwManager_; }

WebServerManager& App::webServerManager() { return *webServerManager_; }

void App::setup() {
    wifiManager_ = new WiFiManager(*this);
    mqttManager_ = new MQTTManager(*this);
    hwManager_ = new HWManager(*this);
    webServerManager_ = new WebServerManager(*this);

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