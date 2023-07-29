#include <ESP8266WiFi.h>

#include "./connections/mqtt-connection/mqtt-connection.h"
#include "./connections/wifi-connection/wifi-connection.h"
#include "utils/constants.h"

WiFiConnectionManager wifiManager;
MQTTConnectionManager mqttManager;

void setup() {
    Serial.begin(115200);
    wifiManager.init();
    mqttManager.init();
}

void loop() {
    mqttManager.loop();
    mqttManager.publish("hello world", "test");
    delay(1000);
}
