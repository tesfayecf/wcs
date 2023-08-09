#include "WiFiManager.h"

#include <ESP8266WiFi.h>

#include "../../utils/constants.h"

WiFiManager::WiFiManager(App& app) : appInstance(app) {}

void WiFiManager::setup() {
    // Connect to WiFi
    if (!this->connect()) {
        Serial.println("WiFi connection failed");
        appInstance.stop();
        return;
    }
}

void WiFiManager::loop() {
    // check wifi is connected and continue loop
    if (!this->isConnected()) {
        Serial.println("WiFi connection lost");
        this->connect();
        return;
    }
}

bool WiFiManager::connect() {
    IPAddress local_IP(192, 168, 1, 101);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 0, 0);
    if (!WiFi.config(local_IP, gateway, subnet)) {
        return false;
    }
    WiFi.disconnect();
    WiFi.mode(WIFI_OFF);
    delay(500);
    WiFi.mode(WIFI_AP_STA);
    int r = 0;
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  // Connect to your WiFi router
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        r++;
        if (r == 150) break;
    }
    if (r == 150) {
        return false;
    }
    Serial.println("Connected to WiFi");
    return true;
}

bool WiFiManager::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

wl_status_t WiFiManager::getStatus() { return WiFi.status(); }
