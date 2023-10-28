#include "App/App.cpp"
#include "App/App.h"
#include "App/AppConfig.h"
#include "utils/types.h"

AppConfig appConfig;
App app(appConfig);

void setup() {
  Serial.begin(115200);
  app.setup();
}

void loop() { app.loop(); }