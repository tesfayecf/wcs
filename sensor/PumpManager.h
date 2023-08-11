#ifndef PUMPMANAGER_CONNECTION_MANAGER_H
#define PUMPMANAGER_CONNECTION_MANAGER_H
#include "Arduino.h"

class PumpManager {
   private:
    bool pumpActive = false;
    bool startButtonState = false;
    bool stopButtonState = false;

   public:
    PumpManager();

    void setup();
    void loop();

    void turnOnPump();
    void turnOffPump();
    bool getPumpStatus();
};

#endif  // PUMPMANAGER_CONNECTION_MANAGER_H