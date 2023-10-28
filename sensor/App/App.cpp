#include "App.h"

#include "../../managers/hardware-manager/HWManager.cpp"
#include "../../managers/hardware-manager/HWManager.h"
#include "../../managers/hardware-manager/Sensor.cpp"
#include "../../managers/hardware-manager/Sensor.h"
#include "../../managers/mqtt-manager/MQTTManager.cpp"
#include "../../managers/mqtt-manager/MQTTManager.h"
#include "../../managers/wifi-manager/WifiManager.cpp"
#include "../../managers/wifi-manager/WifiManager.h"
#include "../utils/constants.h"
#include "../utils/types.h"
#include "./AppConfig.h"

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
  this->blink();

  mqttManager_->setup();
  this->blink();

  hwManager_->setup();
  this->blink();

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
  Serial.println("Board info:");
  Serial.print("Board Chip ID: ");
  Serial.println(this->appConfig.boardInfo.boardChipId);
  Serial.print("Board Flash Chip ID: ");
  Serial.println(this->appConfig.boardInfo.boardFlashChipId);
  Serial.print("Board Core Version: ");
  Serial.println(this->appConfig.boardInfo.boardCoreVersion);
  Serial.print("Board Flash Chip Size: ");
  Serial.println(this->appConfig.boardInfo.boardFlashChipSize);
  Serial.print("Board Flash Chip Real Size: ");
  Serial.println(this->appConfig.boardInfo.boardFlashChipRealSize);
  Serial.print("Board CPU Frequency: ");
  Serial.println(this->appConfig.boardInfo.boardCpuFreqMHz);
  Serial.print("Board Free Heap: ");
  Serial.println(this->appConfig.boardInfo.boardFreeHeap);
  Serial.print("Board Heap Fragmentation: ");
  Serial.println(this->appConfig.boardInfo.boardHeapFragmentation);
  Serial.print("Board Sketch Size: ");
  Serial.println(this->appConfig.boardInfo.boardSketchSize);
}

/**
 * @brief Sets the sensor information in the AppConfig object.
 *
 * @details This function generates a unique sensor ID based on the board
 * information and sets it in the AppConfig object.
 */
void App::setSensorInfo() {
  Serial.println("Sensor info:");
  Serial.print("Sensor ID: ");
  Serial.println(this->appConfig.appInfo.sensorId);
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
