#ifndef APP_H
#define APP_H

#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/constants.h"
#include "../utils/types.h"
#include "./AppConfig.h"
#include "Arduino.h"

class App {
 private:
  AppConfig appConfig;
  Managers managers;
  WifiManager* wifiManager_;
  MQTTManager* mqttManager_;
  HWManager* hwManager_;

 public:
  /**
   * @brief Constructor for the App class.
   *
   * @param config The AppConfig object.
   */
  App(const AppConfig& config);

  /**
   * @brief Sets up the application.
   */
  void setup();

  /**
   * @brief Main loop for the application.
   */
  void loop();

  /**
   * @brief Stops the application.
   */
  void stop();

  /**
   * @brief Restarts the application.
   */
  void restart();

 private:
  /**
   * @brief Sets the board information in the AppConfig object.
   */
  void setBoardInfo();

  /**
   * @brief Sets the sensor information in the AppConfig object.
   */
  void setAppInfo();
};

#endif  // APP_H