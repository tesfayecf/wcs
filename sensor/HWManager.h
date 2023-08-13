#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

#include <NewPing.h>
#include <Wire.h>

#include "Arduino.h"
#include "utils/AppConfig.h"
#include "utils/constants.h"
// #include "utils/types.h"
struct Managers;

class HWManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

    NewPing sonar;

   public:
    // Constructor
    HWManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    // Setup IR connection
    void setup();

    void loop();

    // Get distance from IR
    unsigned int getDistance();

    float convertToCm(unsigned int distance);
};

#endif  // HW_CONNECTION_MANAGER_H