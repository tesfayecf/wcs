#include "Arduino.h"

// #include "App.cpp"  // BUG ALERT
#include "src/app/App.h"
#include "src/app/AppConfig.h"

// Create an instance of the AppConfig class to hold configuration data
AppConfig appConfig;

// Create an instance of the App class, passing the AppConfig instance
App app(appConfig);

void setup() {
    // Initialize serial communication at a baud rate of 115200
    Serial.begin(115200);
    // Call the setup function of the App class to set up the application
    app.setup();
}

void loop() {
    // Call the loop function of the App class to run the main application loop
    app.loop();
}