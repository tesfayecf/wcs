#ifndef PUMPMANAGER_CONNECTION_MANAGER_H
#define PUMPMANAGER_CONNECTION_MANAGER_H
class App;  // Forward declaration of App

class PumpManager {
   private:
    App& appInstance;

    // Button debounce time in milliseconds
    const unsigned long DEBOUNCE_TIME = 200;

    bool pumpActive = false;  // Pump state
    // bool startButtonState = false;      // Start button state
    // bool stopButtonState = false;       // Stop button state
    bool prevStartButtonState = false;  // Previous start button state
    bool prevStopButtonState = false;   // Previous stop button state

    unsigned long lastDebounceTime = 0;  // Last debounce time
    bool startButtonPressed = false;     // Start button pressed state
    bool stopButtonPressed = false;      // Stop button pressed state

   public:
    PumpManager(App& app);

    void setup();
    void loop();
};

#include "PumpManager.cpp"
#endif  // PUMPMANAGER_CONNECTION_MANAGER_H