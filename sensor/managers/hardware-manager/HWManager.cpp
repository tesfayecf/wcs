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

void HWManager::setup() {
  Serial.println("Initializing HWManager");
  Serial.println("HWManager Initialized");
}

void HWManager::loop() {}

unsigned int HWManager::getDistance() {
  unsigned int distance = HWManager::sonar.ping(100);
  return distance;
}

unsigned long HWManager::getDistanceCm() {
  unsigned long distance = HWManager::sonar.ping_cm(100);
  return distance;
}