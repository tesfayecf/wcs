#include "HWManager.h"

#include <ESP8266WiFi.h>

#include "utils/AppConfig.h"
#include "utils/constants.h"
// #include "utils/types.h"
struct Managers;

HWManager::HWManager() : sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE) {}

void HWManager::init(AppConfig* config_, Managers* managers_) {
    Serial.println("HWManager init");
    managers = managers_;
    appConfig = config_;
}

void HWManager::setup() { Serial.println("Initializing HWManager"); }

void HWManager::loop() {}

unsigned int HWManager::getDistance() {
    unsigned int distance = sonar.ping(450);
    return distance;
}

float HWManager::convertToCm(unsigned int distance) {
    // calculate time basad on humidity and temperature
    return distance / 57;
}