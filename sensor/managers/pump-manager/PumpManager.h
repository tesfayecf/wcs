#ifndef PUMPMANAGER_CONNECTION_MANAGER_H
#define PUMPMANAGER_CONNECTION_MANAGER_H
class App;  // Forward declaration of App

class PumpManager {
   private:
    App& appInstance;

    static bool pumpActive;
    static bool startButtonState;
    static bool stopButtonState;

   public:
    PumpManager(App& app);

    void setup();
    void loop();

    void turnOnPump();
    void turnOffPump();
    bool getPumpStatus();
};

#include "PumpManager.cpp"
#endif  // PUMPMANAGER_CONNECTION_MANAGER_H