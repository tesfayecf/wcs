#include "HWConnectionManager.h"

#include <ESP8266WiFi.h>

#include "../../utils/constants.h"

HWConnectionManager::HWConnectionManager(App& app)
    : appInstance(app), sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE) {}

void HWConnectionManager::init() {}

void HWConnectionManager::loop() {}

unsigned int HWConnectionManager::getDistance() {
    unsigned int distance = sonar.ping(450);
    return distance;
}

float HWConnectionManager::convertToCm(unsigned int distance) {
    // calculate time basad on humidity and temperature
    return distance / 57;
}