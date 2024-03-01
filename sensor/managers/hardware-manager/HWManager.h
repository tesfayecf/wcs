#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

// #include <NewPing.h>
#include "Sensor.h"
// #include <Wire.h>

#include "../../App/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class App;

class HWManager {
  private:
    App* app;
    AppConfig* appConfig;

    unsigned int distanceCm;
    unsigned int distanceRaw;

  public:
    // static Ultrasonic sonar;
    static Sensor ultraSonicSensor;
    
    // Constructor
    HWManager();

    // Initialize manager
    void init(App* app_, AppConfig* config_);

    // Setup Ultrasonic connection
    void setup();

    // Read and send data
    void loop();

    // Publish to mqtt server
    void publishData();

    // Get distance from Ultrasonic sensor
    void readDistanceSensor();
    unsigned int getDistance();
    unsigned int getDistanceCm();
};

#endif  // HW_CONNECTION_MANAGER_H