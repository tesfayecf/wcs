#include "utils/constants.h"

void setup() { Serial.begin(115200); }

void loop() {
    Serial.println("Hello World");
    Serial.println(WIFI_SSID);
}
