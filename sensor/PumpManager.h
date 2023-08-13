#ifndef PUMPMANAGER_CONNECTION_MANAGER_H
#define PUMPMANAGER_CONNECTION_MANAGER_H
#include "Arduino.h"
#include "utils/AppConfig.h"
#include "utils/constants.h"
// #include "utils/types.h"
struct Managers;

class PumpManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

   public:
    PumpManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    void setup();
    void loop();

    void turnOnPump();
    void turnOffPump();
    bool getPumpStatus();

    static bool pumpActive;
    static bool startButtonState;
    static bool stopButtonState;
};

#endif  // PUMPMANAGER_CONNECTION_MANAGER_H