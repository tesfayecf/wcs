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
    webserver.on("/", [this]() { this->renderMainPage(this->managers); });
    // WebServerManager::webserver.on("/ON",
    //                                [this]() { this->turnON(this->managers);
    //                                });
    // WebServerManager::webserver.on("/OFF",
    //                                [this]() { this->turnOFF(this->managers);
    //                                });
    webserver.begin();

    // // Websocket
    // // webSocket.onEvent(
    // //     [this](uint8_t num, WStype_t type, uint8_t* payload, size_t
    // length) {
    // //         this->webSocketEvent(num, type, payload, length,
    // this->managers);
    // //     });

    // webSocket.begin();
};

void WebServerManager::loop() {
    // webSocket.loop();
    webserver.handleClient();

    // sendWSMessage();
}

void WebServerManager::renderMainPage(Managers* managers) {
    String content = main_page;
    Serial.println("Rendering main page");
    unsigned int fileSize = content.length();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", String(fileSize));
    webserver.send(200, "text/html", content);
}

void WebServerManager::turnON(Managers* managers) {
    managers->pumpManager->turnOnPump();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", "2");
    webserver.send(200, "text/plain", "ON");
}

void WebServerManager::turnOFF(Managers* managers) {
    managers->pumpManager->turnOffPump();
    webserver.sendHeader("Access-Control-Allow-Origin", "*");
    webserver.sendHeader("Content-Length", "2");
    webserver.send(200, "text/plain", "OFF");
}

void WebServerManager::sendWSMessage() {
    // char message[200];
    // unsigned time = millis() / 1000;
    // unsigned int sensorValue = this->managers->hwManager->getDistance();
    // float sensorValueCM =
    // this->managers->hwManager->convertToCm(sensorValue); bool pumpStatus =
    // this->managers->pumpManager->getPumpStatus(); sprintf(message,
    // "{\"serverTime\":%d,\"pumpStatus\":%d,\"sensorValue\":%d}",
    //         time, sensorValueCM, pumpStatus);
    // webSocket.broadcastTXT(message);
}