#include "App.h"

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.cpp"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/AppConfig.h"
#include "../utils/constants.h"
#include "../utils/types.h"


App::App(const AppConfig& config)
    : wifiManager_(nullptr),
      mqttManager_(nullptr),
      hwManager_(nullptr),
      appConfig(config) {
  managers.wifiManager = wifiManager_;
  managers.mqttManager = mqttManager_;
  managers.hwManager = hwManager_;
}



void App::setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  this->setBoardInfo();
  this->setSensorInfo();

  wifiManager_ = new WifiManager();
  mqttManager_ = new MQTTManager();
  hwManager_ = new HWManager();

  wifiManager_->init(&this->appConfig, &this->managers);
  mqttManager_->init(&this->appConfig, &this->managers);
  hwManager_->init(&this->appConfig, &this->managers);

  wifiManager_->setup();
  blink();

  mqttManager_->setup();
  blink();

  hwManager_->setup();
  blink();

  digitalWrite(LED_BUILTIN, LOW);
}

void App::loop() {
  if (millis() % 1000 == 0) {
    wifiManager_->loop();  // check wifi connection
    mqttManager_->loop();  // check mqtt messages
    hwManager_->loop();    // check hardware connection
  }
}

/**
 * @brief Stops the application.
 *
 * @details This function can be used to stop the application if needed.
 * Currently, it is empty and does not have any functionality.
 */
void App::stop() {}

/**
 * @brief Restarts the application.
 *
 * @details This function restarts the application by calling the ESP.restart()
 * function.
 */
void App::restart() { ESP.restart(); }


/**
 * @brief Sets the board information in the AppConfig object.
 *
 * @details This function retrieves various board information using the ESP8266
 * functions and sets them in the AppConfig object. It also prints "Board info
 * saved" to the serial monitor.
 */
void App::setBoardInfo() {
  this->appConfig.boardInfo.boardChipId = ESP.getChipId();
  this->appConfig.boardInfo.boardFlashChipId = ESP.getFlashChipId();
  this->appConfig.boardInfo.boardCoreVersion = ESP.getCoreVersion();
  this->appConfig.boardInfo.boardFlashChipSize = ESP.getFlashChipSize();
  this->appConfig.boardInfo.boardFlashChipRealSize = ESP.getFlashChipRealSize();
  this->appConfig.boardInfo.boardCpuFreqMHz = ESP.getCpuFreqMHz();
  this->appConfig.boardInfo.boardFreeHeap = ESP.getFreeHeap();
  this->appConfig.boardInfo.boardHeapFragmentation = ESP.getHeapFragmentation();
  this->appConfig.boardInfo.boardSketchSize = ESP.getSketchSize();
  this->appConfig.boardInfo.boardFreeSketchSpace = ESP.getFreeSketchSpace();
  this->appConfig.boardInfo.boardSketchMD5 = ESP.getSketchMD5();
  this->appConfig.boardInfo.boardFlashChipSpeed = ESP.getFlashChipSpeed();
  this->appConfig.boardInfo.boardCycleCount = ESP.getCycleCount();

  Serial.println("Board info saved");
}


/**
 * @brief Sets the sensor information in the AppConfig object.
 *
 * @details This function generates a unique sensor ID based on the board
 * information and sets it in the AppConfig object.
 */
void App::setSensorInfo() {
  this->appConfig.appInfo.sensorId = generateSensorID();
}


/**
 * @brief Generates a unique sensor ID based on board information.
 *
 * @return The generated sensor ID.
 *
 * @details This function generates a unique sensor ID by combining the board
 * chip ID and flash chip ID. It then calculates the MD5 hash of the combined
 * string to ensure uniqueness. The generated sensor ID is printed to the serial
 * monitor and returned.
 */
String App::generateSensorID() {
  String uniqueString = String(this->appConfig.boardInfo.boardChipId) +
                        String(this->appConfig.boardInfo.boardFlashChipId);
  MD5Builder md5;
  md5.begin();
  md5.add(uniqueString);
  md5.calculate();
  String sensorID = md5.toString();

  Serial.print("Generated Sensor ID: ");
  Serial.println(sensorID);

  return sensorID;
}


/**
 * @brief Blinks the built-in LED.
 *
 * @details This function blinks the built-in LED on the board by turning it on
 * for 100 milliseconds and then off for 100 milliseconds.
 */
void App::blink() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  delay(100);
}

