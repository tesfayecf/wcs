#ifndef HW_CONNECTION_MANAGER_H
#define HW_CONNECTION_MANAGER_H

#include <NewPing.h>
#include <Wire.h>

#include "../../utils/constants.h"
class App;  // Forward declaration of App

class HWConnectionManager {
   private:
    NewPing sonar;
    App& appInstance;

   public:
    // Constructor
    HWConnectionManager(App& app);

    // Initialize IR connection
    void setup();

    void loop();

    // Get distance from IR
    unsigned int getDistance();

    float convertToCm(unsigned int distance);
};

#include "HWConnectionManager.cpp"
#endif  // HW_CONNECTION_MANAGER_H
