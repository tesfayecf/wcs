#include "WebServerManager.h"

#include "../../utils/constants.h"
#include "webpage.h"

ESP8266WebServer WebServerManager::webserver(WEB_SERVER_PORT);
WebSocketsServer WebServerManager::webSocket(WEBSOCKET_PORT);

WebServerManager::WebServerManager(App& app) : appInstance(app) {}

void WebServerManager::setup() {
    Serial.println("Initializing WebServerManager");
    // Webserver
    WebServerManager::webserver.on("/", WebServerManager::renderMainPage);
    WebServerManager::webserver.on("/ON", WebServerManager::turnON);
    WebServerManager::webserver.on("/OFF", WebServerManager::turnOFF);
    WebServerManager::webserver.begin();
    // Websocket
    webSocket.begin();
}

void WebServerManager::loop() {
    WebServerManager::webSocket.loop();
    WebServerManager::webserver.handleClient();

    WebServerManager::sendWSMessage();
}

void WebServerManager::renderMainPage() {
    String content = main_page;  // Read HTML contents
    unsigned int fileSize = content.length();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", String(fileSize));
    WebServerManager::webserver.send(200, "text/html", content);
}

void WebServerManager::turnON() {
    this->appInstance.pumpManager().turnOnPump();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", "2");
    WebServerManager::webserver.send(200, "text/plain", "ON");
}

void WebServerManager::turnOFF() {
    this->appInstance.pumpManager().turnOffPump();
    WebServerManager::webserver.sendHeader("Access-Control-Allow-Origin", "*");
    WebServerManager::webserver.sendHeader("Content-Length", "2");
    WebServerManager::webserver.send(200, "text/plain", "OFF");
}

void WebServerManager::sendWSMessage() {
    char message[200];
    unsigned time = this->appInstance.sensorTime;
    unsigned int sensorValue = this->appInstance.hwManager().getDistance();
    float sensorValueCM =
        this->appInstance.hwManager().convertToCm(sensorValue);
    bool pumpStatus = this->appInstance.pumpManager().getPumpStatus();
    sprintf(message, "{\"serverTime\":%d,\"pumpStatus\":%d,\"sensorValue\":%d}",
            time, sensorValueCM, pumpStatus);
}