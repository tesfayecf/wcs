#include <ESP8266WiFi.h>

#include "./utils/constants.h"
#include "wifi-connection.h"

WiFiConnectionManager::WiFiConnectionManager() {}

void WiFiConnectionManager::init() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
}

bool WiFiConnectionManager::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

wl_status_t WiFiConnectionManager::getStatus() { return WiFi.status(); }
