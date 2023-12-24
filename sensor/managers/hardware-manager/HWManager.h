#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

// #include <NewPing.h>
#include "Sensor.h"
// #include <Wire.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class HWManager {
  private:
    AppConfig* appConfig;
    Managers* managers;

    unsigned int distanceCM;
    unsigned int distanceRAW;

  public:
    // static Ultrasonic sonar;
    static Sensor ultraSonicSensor;
    // Constructor
    HWManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    // Setup US connection
    void setup();

    void loop();

    void readSensorValues(unsigned int& distanceRaw, unsigned int& distanceCm);

    // Get distance from US
    unsigned int getDistance();
    unsigned int getDistanceCm();
};

#endif  // HW_CONNECTION_MANAGER_H