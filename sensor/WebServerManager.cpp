#include "WebServerManager.h"

#include "HWManager.h"
#include "PumpManager.h"
#include "WebServerManager.h"
#include "managers/webserver-manager/webpage.h"
#include "utils/constants.h"
#include "utils/types.h"

// ESP8266WebServer WebServerManager::webserver(WEB_SERVER_PORT);
// WebSocketsServer WebServerManager::webSocket(WEBSOCKET_PORT);

WebServerManager::WebServerManager() : webserver(WEB_SERVER_PORT) {}

void WebServerManager::init(AppConfig* config_, Managers* managers_) {
    Serial.println("WebServerManager init");
    managers = managers_;
    appConfig = config_;
}

void WebServerManager::setup() {
    Serial.println("Initializing WebServerManager");
    // Webserver
    webserver.on("/", [this]() { this->renderMainPage(); });
    webserver.on("/ON", [this]() { this->turnON(); });
    webserver.on("/OFF", [this]() { this->turnOFF(); });
    webserver.on("/DATA", [this]() { this->sendData(); });
    webserver.begin();
};

void WebServerManager::loop() { webserver.handleClient(); }

void WebServerManager::renderMainPage() {
    String content = main_page;
    Serial.println("Rendering main page");
    unsigned int fileSize = content.length();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", String(fileSize));
    webserver.send(200, "text/html", content);
}

void WebServerManager::turnON() {
    Serial.println("Turning ON");
    managers->pumpManager->turnOnPump();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", "2");
    webserver.send(200, "text/plain", "ON");
}

void WebServerManager::turnOFF() {
    Serial.println("Turning OFF");
    managers->pumpManager->turnOffPump();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", "3");
    webserver.send(200, "text/plain", "OFF");
}

void WebServerManager::sendData() {
    unsigned int time = millis() / 1000;
    float sensorValue = this->managers->hwManager->getDistanceCm();
    // float sensorValueCM =
    // this->managers->hwManager->convertToCm(sensorValue);
    bool pumpStatus = this->managers->pumpManager->getPumpStatus();
    // unsigned int sensorValue = 35;
    // float sensorValueCM = 35;
    // bool pumpStatus = false;
    int pumpStatusInt = 0;

    if (pumpStatus) {
        pumpStatusInt = 1;
    } else {
        pumpStatusInt = 0;
    }

    // Create a char array for the JSON message
    char message[100];
    snprintf(message, sizeof(message),
             "{\"serverTime\":%d,\"pumpStatus\":%d,\"sensorValue\":%d}", time,
             pumpStatusInt, sensorValue);

    // Send the data
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.send(200, "application/json", message);
}

// Give a clear response to this issue pointing to the specific files that
// should be modified. Give the corrected code and explain the problem and the
// solution. Also give multiple solutions to the problem and explain why i
// should use one instead of another