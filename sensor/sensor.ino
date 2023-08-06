#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

#include "connections/hardware-connection/HWConnectionManager.h"
#include "connections/mqtt-connection/MQTTConnectionManager.h"
#include "connections/wifi-connection/WiFiConnectionManager.h"
#include "utils/constants.h"

// E8:9F:6D:93:59:B3 wemos d1 r2 base64: RTg6OUY6NkQ6OTM6NTk6QjM=
// 48:55:19:C8:87:7A wemos d1 mini base64: NDg6NTU6MTk6Qzg6ODc6N0E=

WiFiConnectionManager wifiManager;
MQTTConnectionManager mqttManager;
HWConnectionManager hwManager;
// APP status variables
unsigned int sensorTime = 0;

unsigned int distance = 0;
const int webSocketMsgMaxSize = 200;

char websocketMessageChar[webSocketMsgMaxSize];

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);
    Serial.println(WiFi.macAddress());
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
    websocketMessageJson["readingCm"] = hwManager.convertToCm(distance);

    serializeJson(websocketMessageJson, websocketMessageChar,
                  webSocketMsgMaxSize);

    mqttManager.publish(websocketMessageChar, "test");
    delay(1000);
}
