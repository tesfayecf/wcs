#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H

#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

#include "Arduino.h"
#include "utils/AppConfig.h"
#include "utils/constants.h"

struct Managers;  // Forward declaration of Managers

class WebServerManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

   private:
    static ESP8266WebServer webserver;
    WebSocketsServer webSocket;

    // HTTP
    static void renderMainPage(Managers* managers);
    void turnON(Managers* managers);
    void turnOFF(Managers* managers);
    // WS
    // void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload,
    //                     size_t length, Managers* managers);
    void sendWSMessage();

   public:
    WebServerManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    void setup();
    void loop();
};

#endif  // WEBSERVER_CONNECTION_MANAGER_H