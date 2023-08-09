#include "WebServerManager.h"

WebServerManager::WebServerManager(App& app) : appInstance(app) {}

void WebServerManager::init() {
    Serial.println("Initializing WebServerManager");
}

void WebServerManager::loop() {}