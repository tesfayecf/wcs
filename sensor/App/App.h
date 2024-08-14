#ifndef APP_H
#define APP_H

#include "Arduino.h"

#include "../../managers/hardware/HWManager.h"
#include "../../managers/mqtt/MQTTManager.h"
#include "../../managers/wifi/WifiManager.h"

#include "../utils/constants.h"
#include "../utils/types.h"
// #include "../misc/queue.h"
#include "./AppConfig.h"

class App {
  public:
    AppConfig appConfig;

    WifiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;

  private:
    // Queue<String> dataQueue

  public:
    // Constructor for the App class.
    App(const AppConfig& config);

    // Sets up the application.
    void setup();

    // Main loop for the application.
    void loop();

    // Stops the application.
    void stop();

    // Restarts the application.
    void restart();

  private:
    /// GETTERS ///
    // Gets the AppConfig object.
    AppConfig& getAppConfig();  
    // Gets the board information.
    AppConfig::BoardInfo& getBoardInfo();  
    // Gets the app information.
    AppConfig::AppInfo& getAppInfo();
    // Gets the data queue.
    // Queue<String> getDataQueue();

    /// SETTERS ///
    // Sets the board information in the AppConfig object.
    void setBoardInfo();
    // Sets the app information in the AppConfig object.
    void setAppInfo();
};

#endif  // APP_H