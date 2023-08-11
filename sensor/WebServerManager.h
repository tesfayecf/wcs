#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H

#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

#include "Arduino.h"
#include "utils/constants.h"

class WebServerManager {
   private:
    static ESP8266WebServer webserver;
    WebSocketsServer webSocket;

    // HTTP
    static void renderMainPage();
    static void turnON();
    static void turnOFF();
    // WS
    void sendWSMessage();

   public:
    WebServerManager();

    void setup();
    void loop();
};

#endif  // WEBSERVER_CONNECTION_MANAGER_H