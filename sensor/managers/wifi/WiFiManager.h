#ifndef WIFI_CONNECTION_MANAGER_H
#define WIFI_CONNECTION_MANAGER_H

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <EEPROM.h>

#include "../../app/AppConfig.h"
#include "../../utils/types.h"
#include "../BaseManager.h"

class App;

class WifiManager : public BaseManager {
private:
    ESP8266WebServer server;
    String ssid;
    String password;
    WiFiConnectionState state;
    bool connected;

public:
    // Constructor
    WifiManager();

    // Initialize manager
    void init() override;

    // Setup WiFi connection
    void setup() override;

    // Loop manager to check WiFi connection status
    void loop() override;

private:
    // Establish WiFi connection
    boolean connect();

    // Start WiFi connection
    boolean startConnection();

    // Set WiFi connection parameters
    void setConnectionInfo();

    // Start configuration portal
    boolean startConfigPortal();

    // Render main configuration page
    void renderMainPage();

    // Read WiFi credentials from EEPROM
    boolean readCredentials();

    // Receive WiFi credentials from configuration page
    boolean getCredentials();

    // Store WiFi credentials in EEPROM
    boolean storeCredentials(const String &ssid, const String &password);

    // Convert IP address to string
    String ipToString(IPAddress ip);
};

#endif  // WIFI_CONNECTION_MANAGER_H