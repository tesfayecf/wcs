#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <EEPROM.h>

#include "../../utils/AppConfig.h"
#include "../../utils/types.h"
#include "Arduino.h"

class WifiManager {
 private:
  AppConfig* appConfig;
  Managers* managers;

 private:
  WiFiManager wiFiManager;
  ESP8266WebServer server;
  String ssid;
  String password;
  boolean connected;
  boolean configPortalActive;

 public:
  // Constructor
  WifiManager();

  // Initialize manager
  void init(AppConfig* config_, Managers* managers_);

  // Initialize WiFi connection
  void setup();

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
  String toStringIp(IPAddress ip);
};

#endif  // WIFI_CONNECTION_MANAGER_H