#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

#include <NewPing.h>
#include <Wire.h>

#include "Arduino.h"
#include "utils/constants.h"

class HWManager {
   private:
    NewPing sonar;

   public:
    // Constructor
    HWManager();

    // Initialize IR connection
    void setup();

    void loop();

    // Get distance from IR
    unsigned int getDistance();

    float convertToCm(unsigned int distance);
};

#endif  // HW_CONNECTION_MANAGER_H
