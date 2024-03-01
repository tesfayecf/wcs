#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H

#include "Arduino.h"
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <EEPROM.h>

#include "../../App/AppConfig.h"
#include "../../utils/types.h"

class App;

class WifiManager {
 private:
  App* app;
  AppConfig* appConfig;

 private:
  ESP8266WebServer server;
  String ssid;
  String password;
  boolean connected; // TODO: use manager status from appConfig
  boolean connecting; // TODO: use manager status from appConfig

 public:
  // Constructor
  WifiManager();

  // Initialize manager
  void init(App* app_, AppConfig* config_);

  // Initialize WiFi connection
  void setup();

  // Loop manager to check WiFi connection status
  void loop();

  // Check if WiFi is connected
  bool isConnected();

  // Get the WiFi connection status
  wl_status_t getStatus();

 private:
  boolean autoConnect();
  boolean connect();

  boolean startConfigPortal();
  void renderMainPage();
  void receiveCredentials();

  boolean getWifiCredentials();
  boolean storeWifiCredentials(const String &ssid, const String &password);
  
  // Utils
  String toStringIp(IPAddress ip);
  void setWifiConnectionInfo();
};

#endif  // WIFI_CONNECTION_MANAGER_H