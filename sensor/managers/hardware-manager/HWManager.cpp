#include "HWManager.h"

#include <ESP8266WiFi.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"

NewPing HWManager::sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

HWManager::HWManager() {}

void HWManager::init(AppConfig* config_, Managers* managers_) {
    Serial.println("HWManager init");
    managers = managers_;
    appConfig = config_;
}

void HWManager::setup() { Serial.println("Initializing HWManager"); }

void HWManager::loop() {}

unsigned int HWManager::getDistance() { return HWManager::sonar.ping(450); }

float HWManager::getDistanceCm() {
    // calculate time basad on humidity and temperature
    return HWManager::sonar.ping(450) / 57;
}