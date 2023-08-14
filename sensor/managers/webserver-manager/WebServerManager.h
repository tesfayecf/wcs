#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H

#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class WebServerManager {
   private:
    AppConfig* appConfig;
    Managers* managers;

   private:
    ESP8266WebServer webserver;

    // HTTP
    void renderMainPage();
    void turnON();
    void turnOFF();
    void sendData();

   public:
    WebServerManager();

    // Initialize manager
    void init(AppConfig* config_, Managers* managers_);

    void setup();
    void loop();
};

#endif  // WEBSERVER_CONNECTION_MANAGER_H