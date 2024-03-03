#include "HWManager.h"

#include <ESP8266WiFi.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Sensor.h"

HWManager::HWManager() : distanceSensor(TRIGGER_PIN, ECHO_PIN, TIMEOUT) {}

void HWManager::init() {
  Serial.println("HWManager initialized");
}

void HWManager::setup() {
  Serial.println("HWManager setup");
}

void HWManager::loop() {
  // Publish sensor data periodically
  if (millis() % LOG_RATE == 0) {
    // Distance
    this->readDistanceSensor();

    // Temperature
    // this->readTemperatureSensor();

    // Humidity
    // this->readHumiditySensor();

    // Publish sensor data
    this->publishData();
  }
}


void HWManager::publishData() {
  // Create data message
  MQTTMessage message;
  message.type = MESSAGE_TYPES::DATA;
  message.action = MESSAGE_ACTIONS::SENSOR_DATA;
  // message.params[0] = String(this->distance).c_str();
  String distance = "0";
  message.params[0] = distance.c_str();
  message.paramsCount = 1;

  // Publish sensor data
  this->app->mqttManager->publish(&message);
}

void HWManager::readDistanceSensor() {
  unsigned int sumDistance = 0;
  int validReadings = 0;

  // Take multiple readings
  for (size_t i = 0; i < 10; i++) {
    // unsigned int distance_ = getDistance();
    unsigned int distance_ = this->distanceSensor.read();
    
    // Print a dot for each reading
    Serial.print(".");
    delay(10);
    
    // Check if readings are faulty
    if (distance_ < 200) {
      sumDistance += distance_;
      validReadings++;
    }
  }
  Serial.println("");

  // Compute the average if there are valid readings
  if (validReadings > 0) {
    this->distance = sumDistance / validReadings;
  } else {
    // If no valid readings, set distances to 0
    this->distance = 0;
  }
}