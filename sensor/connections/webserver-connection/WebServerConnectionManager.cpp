#include "WebServerConnectionManager.h"

WebServerConnectionManager::WebServerConnectionManager(App& app)
    : appInstance(app) {}

void WebServerConnectionManager::init() {
    Serial.println("Initializing WebServerConnectionManager");
}

void WebServerConnectionManager::loop() {}