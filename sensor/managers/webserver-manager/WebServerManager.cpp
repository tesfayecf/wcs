#include "WebServerManager.h"

WebServerManager::WebServerManager(App& app) : appInstance(app) {}

void WebServerManager::setup() {
    Serial.println("Initializing WebServerManager");
}

void WebServerManager::loop() {}