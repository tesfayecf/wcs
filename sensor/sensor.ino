#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

#include "connections/hardware-connection/HWConnectionManager.h"
#include "connections/mqtt-connection/MQTTConnectionManager.h"
#include "connections/wifi-connection/WiFiConnectionManager.h"
#include "utils/constants.h"

WiFiConnectionManager wifiManager;
MQTTConnectionManager mqttManager;
HWConnectionManager hwManager;

unsigned int distance = 0;
unsigned int sensorTime = 0;
const int webSocketMsgMaxSize = 200;

char websocketMessageChar[webSocketMsgMaxSize];

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);
    Serial.println("Starting...");
    wifiManager.init();
    mqttManager.init();
    hwManager.init();
}

void loop() {
    sensorTime = millis() / 1000;
    mqttManager.loop();

    distance = hwManager.getDistance();

    StaticJsonDocument<webSocketMsgMaxSize> websocketMessageJson;
    websocketMessageJson["sensorTime"] = sensorTime;
    websocketMessageJson["rawReading"] = distance;
    websocketMessageJson["readingCm"] = hwManager.convertToCm(distance);

    serializeJson(websocketMessageJson, websocketMessageChar,
                  webSocketMsgMaxSize);

    mqttManager.publish(websocketMessageChar, "test");
    delay(1000);
}
