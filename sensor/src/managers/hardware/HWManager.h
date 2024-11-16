#ifndef HW_MANAGER_H
#define HW_MANAGER_H

#include "../../app/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "../BaseManager.h"
#include "Sensor.h"

class App;

class HWManager : public BaseManager {
  private:
    // Distance
    Sensor distanceSensor;
    unsigned int distance;

  public:
    // Constructor
    HWManager();

    // Initialize manager
    void init() override;

    // Setup Ultrasonic connection
    void setup() override;

    // Read and send data
    void loop() override;

  private:
    // Publish to mqtt server
    void publishData();

    // Get distance from Ultrasonic sensor
    void readDistanceSensor();

    // Get temperature from temperature sensor
    // void readTemperatureSensor();

    // Get humidity from humidity sensor
    // void readHumiditySensor();
};

#endif  // HW_MANAGER_H