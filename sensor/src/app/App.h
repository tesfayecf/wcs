#ifndef APP_H
#define APP_H

#include "./AppConfig.h"

#include "../managers/hardware/HWManager.h"
#include "../managers/mqtt/MQTTManager.h"
#include "../managers/wifi/WifiManager.h"

#include "../utils/constants.h"
#include "../utils/types.h"

class App {
  public:
    AppConfig appConfig;

    WifiManager* wifiManager;
    MQTTManager* mqttManager;
    HWManager* hwManager;

  public:
    // Constructor for the App class.
    App(const AppConfig& config);

    // Set up the application.
    void setup();

    // Main loop for the application.
    void loop();

    // Stop the application.
    void stop();

    // Restart the application.
    void restart();

  private:
    ///////////////
    /// GETTERS ///
    ///////////////
    
    // Get the AppConfig object.
    AppConfig& getAppConfig();  
    
    // Get the board information.
    AppConfig::BoardInfo& getBoardInfo();  
    
    // Get the app information.
    AppConfig::AppInfo& getAppInfo();

    // Get the wifi manager information
    AppConfig::WifiManagerInfo& getWifiManagerInfo();

    // Get the mqtt manager information
    AppConfig::MQTTManagerInfo& getMqttManagerInfo();

    // Get the hw manager information
    AppConfig::HWManagerInfo& getHWManagerInfo();

    ///////////////
    /// SETTERS ///
    ///////////////
    
    // Sets the board information in the AppConfig object.
    void setBoardInfo();
    
    // Sets the app information in the AppConfig object.
    void setAppInfo();
};

#endif  // APP_H