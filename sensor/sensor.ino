// Include the implementation file for the App class
#include "App/App.cpp"  // BUG ALERT
// Include the header file for the App class
#include "App/App.h"
// Include the header file for the AppConfig class
#include "App/AppConfig.h"
// Include the header file for custom data types
#include "utils/types.h"

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