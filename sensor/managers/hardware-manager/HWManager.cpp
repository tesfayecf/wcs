#include "HWManager.h"

#include <ESP8266WiFi.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Sensor.h"

// NewPing HWManager::sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
Sensor HWManager::ultraSensor(TRIGGER_PIN, ECHO_PIN, TIMEOUT);

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

void HWManager::readSensorValues(unsigned int& distanceRaw,
                                 unsigned int& distanceCm) {
  unsigned int distanceRaw_ = 0;
  unsigned int distanceCM_ = 0;

  for (size_t i = 0; i < 10; i++) {
    distanceRaw_ = getDistance();
    distanceCM_ = getDistanceCm();
    Serial.print(".");
    delay(10);
    if (distanceRaw_ >= 200 || distanceCM_ >= 3) {
      break;
    }
  }
  Serial.println("");
  if (distanceRaw_ <= 200) {
    distanceRaw_ = distanceCM_ * 57.0;
  } else if (distanceCM_ <= 3) {
    distanceCM_ = distanceRaw_ / 57.0;
  }

  // Check if the values are valid and not zero
  if (distanceRaw_ < 200 && distanceCM_ > 0) {
    // Update the output variables only if the values are valid
    distanceRaw = distanceRaw_;
    distanceCm = distanceCM_;
  } else {
    distanceRaw = distanceRaw_;
    distanceCm = distanceCM_;
  }
}

unsigned int HWManager::getDistance() {
  unsigned int distance = HWManager::ultraSensor.rawRead();
  return distance;
}

unsigned int HWManager::getDistanceCm() {
  unsigned int distance = HWManager::ultraSensor.read();
  return distance;
}