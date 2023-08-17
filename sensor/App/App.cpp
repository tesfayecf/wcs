#include "App.h"

#include <EEPROM.h>

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WiFiManager.cpp"
#include "../../managers/wifi-manager/WiFiManager.h"
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

    wifiManager_ = new WiFiManager();
    mqttManager_ = new MQTTManager();
    hwManager_ = new HWManager();

    wifiManager_->init(&appConfig, &this->managers);
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
    sensorTime = millis();

    if (sensorTime % 1000 == 0) {
        wifiManager_->loop();  // check wifi connection
        mqttManager_->loop();  // check mqtt messages
        hwManager_->loop();    // check hardware connection
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

void App::blink() {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
}