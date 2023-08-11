// #include "App.h"

// #include <EEPROM.h>

// #include "HWManager.h"
// #include "MQTTManager.h"
// #include "PumpManager.h"
// #include "WebServerManager.h"
// #include "WiFiManager.h"
// #include "utils/AppConfig.h"

// App::App(const AppConfig& config) : appConfig(config) {}

// void App::setup() {
//     wifiManager_ = new WiFiManager();
//     mqttManager_ = new MQTTManager(*this);
//     hwManager_ = new HWManager(*this);
//     webServerManager_ = new WebServerManager(*this);
//     pumpManager_ = new PumpManager(*this);

//     Managers managers = {wifiManager_, mqttManager_, hwManager_,
//                          webServerManager_, pumpManager_};

//     wifiManager_->init(&appConfig, &managers);
//     // mqttManager_->init();
//     // hwManager_->init();
//     // webServerManager_->init();
//     // pumpManager_->init();

//     wifiManager_->setup();
//     mqttManager_->setup();
//     hwManager_->setup();
//     webServerManager_->setup();
//     pumpManager_->setup();
// }

// void App::loop() {
//     sensorTime = millis();

//     // // Send sensor readings every minute
//     // if (sensorTime % 10000 == 0) {
//     //     // Get sensor data
//     //     unsigned int value = hwManager_->getDistance();
//     //     // Convert data to cm
//     //     float distance = hwManager_->convertToCm(value);
//     //     // Publish data
//     //     mqttManager_->publishReadings(value, distance);
//     // }

//     if (sensorTime % 1000 == 0) {
//         wifiManager_->loop();  // check wifi connection
//         // mqttManager_->loop();       // check mqtt messages
//         hwManager_->loop();  // check hardware connection
//     }

//     if (sensorTime % 1000 == 0) {
//         webServerManager_->loop();  // check webserver requests
//     }

//     if (sensorTime % 100 == 0) {
//         pumpManager_->loop();
//     }
// }

// void App::stop() {}
// void App::restart() {}

// bool App::getWifiCredentials() {
//     String ssid;
//     for (int i = 0; i < 32; ++i) {
//         ssid += char(EEPROM.read(i));
//     }
//     Serial.println();
//     Serial.print("SSID: ");
//     Serial.println(ssid);
//     Serial.println("Reading EEPROM pass");

//     String password = "";
//     for (int i = 32; i < 96; ++i) {
//         password += char(EEPROM.read(i));
//     }
//     Serial.print("PASS: ");
//     Serial.println(password);

//     if (ssid.length() > 0 && password.length() > 0) {
//         Serial.println("Found wifi credentials");
//         return true;
//     } else {
//         Serial.println("Wifi credentials not found");
//         return false;
//     }
// }