#include "HWManager.h"

#include <ESP8266WiFi.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Sensor.h"

// NewPing HWManager::sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
Sensor HWManager::ultraSonicSensor(TRIGGER_PIN, ECHO_PIN, TIMEOUT);

HWManager::HWManager() {}

void HWManager::init(AppConfig* config_, Managers* managers_) {
  Serial.println("HWManager init");
  managers = managers_;
  appConfig = config_;
}

void HWManager::setup() {
  Serial.println("Initializing HWManager");
  // check sensor works
  Serial.println("HWManager Initialized");
}

void HWManager::loop() {
  // Publish sensor data periodically
  if (millis() % UPDATE_RATE == 0) {
    // Read sensor data
    this->readDistanceSensor();
    // this->readTemperatureSensor();
    // this->readHumiditySensor();

    // Publish sensor data
    this->publishData();
  }
}

void HWManager::publishData() {
  Serial.println("Publishing sensor data");
  Serial.print("Distance: ");
  Serial.print("Raw: ");
  Serial.print (this->distanceRaw);
  Serial.print(" | Cm: ");
  Serial.println(this->distanceCm);
  
  const char* distanceRaw = String(this->distanceRaw).c_str();
  const char* distanceCm = String(this->distanceCm).c_str();

  MQTTMessage message;
  message.type = MESSAGE_TYPES::DATA;
  message.action = MESSAGE_ACTIONS::SENSOR_DATA;
  message.params[0] = distanceRaw;
  message.params[1] = distanceCm;
  message.paramsCount = 2;

  // Publish sensor data
  this->managers->mqttManager->publishMessage(&message);
}

void HWManager::readDistanceSensor() {
  unsigned int sumDistanceRaw = 0;
  unsigned int sumDistanceCm = 0;
  int validReadings = 0;

  // Take multiple readings
  for (size_t i = 0; i < 10; i++) {
    unsigned int distanceRaw_ = getDistance();
    unsigned int distanceCm_ = getDistanceCm();
    
    // Print a dot for each reading
    Serial.print(".");
    delay(10);
    
    // Check if readings are faulty
    if (distanceRaw_ < 200 && distanceCm_ > 0) {
      sumDistanceRaw += distanceRaw_;
      sumDistanceCm += distanceCm_;
      validReadings++;
    }
  }
  Serial.println("");

  // Compute the average if there are valid readings
  if (validReadings > 0) {
    this->distanceRaw = sumDistanceRaw / validReadings;
    this->distanceCm = sumDistanceCm / validReadings;
  } else {
    // If no valid readings, set distances to 0
    this->distanceRaw = 0;
    this->distanceCm = 0;
  }
}

unsigned int HWManager::getDistance() {
  unsigned int distance = HWManager::ultraSonicSensor.rawRead();
  return distance;
}

unsigned int HWManager::getDistanceCm() {
  unsigned int distance = HWManager::ultraSonicSensor.read();
  return distance;
}