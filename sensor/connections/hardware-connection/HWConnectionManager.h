#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

#include <NewPing.h>
#include <Wire.h>

#include "../../utils/constants.h"

class HWConnectionManager {
   private:
    NewPing sonar;

   public:
    // Constructor
    HWConnectionManager();

    // Initialize IR connection
    void init();

    // Get distance from IR
    unsigned int getDistance();

    float convertToCm(unsigned int distance);
};

#include "HWConnectionManager.cpp"
#endif  // HW_CONNECTION_MANAGER_H
