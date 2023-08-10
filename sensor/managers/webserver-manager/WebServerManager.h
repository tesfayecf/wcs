#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H

#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

#include "../../utils/constants.h"

class App;  // Forward declaration of App

class WebServerManager {
   private:
    App& appInstance;

    static ESP8266WebServer webserver;
    static WebSocketsServer webSocket;

    static void renderMainPage();
    void turnON();
    void turnOFF();
    void sendWSMessage();

   public:
    WebServerManager(App& app);

    void setup();
    void loop();

    WebServerManager::sendWSMessage();
};

#include "WebServerManager.cpp"
#endif  // WEBSERVER_CONNECTION_MANAGER_H