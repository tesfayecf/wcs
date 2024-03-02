#ifndef APP_H
#define APP_H

#include "Arduino.h"

#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/constants.h"
#include "../utils/types.h"
#include "./AppConfig.h"

class App {
 public:
  AppConfig appConfig;
  
  WifiManager* wifiManager;
  MQTTManager* mqttManager;
  HWManager* hwManager;

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
  // Sets the board information in the AppConfig object.
  void setBoardInfo();

  // Sets the sensor information in the AppConfig object.
  void setAppInfo();
};

#endif  // APP_H