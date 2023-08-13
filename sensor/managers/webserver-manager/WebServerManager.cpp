#include "WebServerManager.h"

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
// #include "../../utils/types.h"
struct Managers;
#include "webpage.h"

WebServerManager::WebServerManager()
    : webSocket(WEBSOCKET_PORT), webserver(WEB_SERVER_PORT) {}

void WebServerManager::init(AppConfig* config_, Managers* managers_) {
    managers = managers_;
    appConfig = config_;
}

void WebServerManager::setup() {
    Serial.println("Initializing WebServerManager");
    // Webserver
    WebServerManager::webserver.on(
        "/", [this]() { this->renderMainPage(this->managers); });
    WebServerManager::webserver.on("/ON",
                                   [this]() { this->turnON(this->managers); });
    WebServerManager::webserver.on("/OFF",
                                   [this]() { this->turnOFF(this->managers); });
    WebServerManager::webserver.begin();

    webSocket.begin();
};

void WebServerManager::loop() {
    webSocket.loop();
    WebServerManager::webserver.handleClient();

    sendWSMessage();
}

void WebServerManager::renderMainPage(Managers* managers) {
    String content = main_page;
    unsigned int fileSize = content.length();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", String(fileSize));
    WebServerManager::webserver.send(200, "text/html", content);
}

void WebServerManager::turnON(Managers* managers) {
    managers->pumpManager->turnOnPump();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", "2");
    WebServerManager::webserver.send(200, "text/plain", "ON");
}

void WebServerManager::turnOFF(Managers* managers) {
    managers->pumpManager->turnOffPump();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", "2");
    WebServerManager::webserver.send(200, "text/plain", "OFF");
}

void WebServerManager::sendWSMessage() {
    char message[200];
    unsigned time = millis() / 1000;
    unsigned int sensorValue = this->managers->hwManager->getDistance();
    float sensorValueCM = this->managers->hwManager->convertToCm(sensorValue);
    bool pumpStatus = this->managers->pumpManager->getPumpStatus();
    sprintf(message, "{\"serverTime\":%d,\"pumpStatus\":%d,\"sensorValue\":%d}",
            time, sensorValueCM, pumpStatus);
}