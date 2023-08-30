#include "WiFiManager.h"

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "WebPage.h"

WiFiManager::WiFiManager() : server(SERVER_PORT) {
    this->ssid = "";
    this->password = "";
}

void WiFiManager::init(AppConfig* config_, Managers* managers_) {
    Serial.println("WiFiManager init");
    managers = managers_;
    appConfig = config_;
}

void WiFiManager::setup() {
    Serial.println("Initializing WiFiManager");
    EEPROM.begin(EEPROM_SIZE);
    // Connect to WiFi
    if (!this->autoConnect()) {
        Serial.println("WiFi connection failed");
        return;
    }

    Serial.println("WiFiManager Initialized");
}

void WiFiManager::loop() {
    // check wifi is connected and continue loop
    if (!WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi connection lost");
        this->autoConnect();
        return;
    }
}

bool WiFiManager::autoConnect() {
    Serial.println("AutoConnect started");
    if (this->getWifiCredentials()) {
        if (this->connect()) {
            return true;
        }
    }

    // Start config portal
    return this->startConfigPortal();
}

bool WiFiManager::connect() {
    Serial.print("Connecting to Wifi: ");

    IPAddress local_IP(192, 168, 1, 101);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 0, 0);
    if (!WiFi.config(local_IP, gateway, subnet)) {
        this->connected = false;
        Serial.println("WiFi.config connection failed");
        return false;
    }

    // WiFi.begin("ONO1D77", "dVy68naGZU5d");
    if (!WiFi.begin(this->ssid, this->password)) {
        Serial.println("WiFi.begin connection failed");
        this->connected = false;
        return false;
    }

    int r = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        r++;
        Serial.print(".");
        if (r == 150) break;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi connected");
        this->connected = true;
        this->setWifiConnectionInfo();
        return true;
    } else {
        Serial.println("WiFi connection failed");
        this->connected = false;
        return false;
    }
}

boolean WiFiManager::startConfigPortal() {
    // Start config portal
    Serial.println("Starting config portal");

    IPAddress APIP(172, 0, 0, 1);
    IPAddress GATEWAY(172, 0, 0, 1);
    IPAddress SUBNET(255, 255, 0, 0);

    WiFi.mode(WIFI_OFF);
    delay(500);
    WiFi.mode(WIFI_AP_STA);

    if (!WiFi.softAPConfig(APIP, GATEWAY, SUBNET)) {
        return false;
    }

    String portalSSID = "WCS-sensor-" + String(ESP.getChipId());
    Serial.print("Portal SSID: ");
    Serial.println(portalSSID);

    DNSServer dnsServer;
    dnsServer.start(53, "*", APIP);  // DNS spoofing (Only for HTTP)

    WiFi.softAP(portalSSID);
    bool res = WiFi.setHostname("WCS_config");

    server.on("/", HTTP_GET, [this]() { this->renderMainPage(); });
    server.on("/setCredentials", HTTP_POST,
              [this]() { this->receiveCredentials(); });
    server.onNotFound([this]() { this->renderMainPage(); });

    server.begin();
    Serial.println("Portal started");

    while (this->connected == false) {
        dnsServer.processNextRequest();
        server.handleClient();
        delay(10);
    }

    Serial.println("Portal closed");
    Serial.println(this->connected);

    return this->connected;
}

void WiFiManager::renderMainPage() {
    String serverLoc = toStringIp(server.client().localIP());
    bool doredirect = serverLoc != server.hostHeader();
    if (doredirect) {
        server.sendHeader(F("Location"), (String)F("http://") + serverLoc,
                          true);
        server.send(302, "text/plain", "");
        server.client().stop();
    }

    String mainPage = wifi_page;
    unsigned int fileSize = mainPage.length();
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Content-Length", String(fileSize));
    server.send(200, "text/html", mainPage);
}

void WiFiManager::receiveCredentials() {
    // Wifi credentials received
    String ssid = server.arg("ssid");
    String password = server.arg("password");
    Serial.println(ssid);
    Serial.println(password);
    if (storeWifiCredentials(ssid, password)) {
        if (connect()) {
            server.send(200, "text/html", "OK");
            return;
        }
    }
    server.send(200, "text/html", "FAIL");
    return;
}

bool WiFiManager::getWifiCredentials() {
    EEPROM.begin(EEPROM_SIZE);
    delay(10);

    String ssid_ = "";
    for (int L = SSID_START_ADDR; L < PASSWORD_START_ADDR; ++L) {
        if (isAlphaNumeric(EEPROM.read(L))) {
            ssid_ += char(EEPROM.read(L));
        }
    }

    String password_ = "";
    for (int L = PASSWORD_START_ADDR; L < EEPROM_SIZE; ++L) {
        if (isAlphaNumeric(EEPROM.read(L))) {
            password_ += char(EEPROM.read(L));
        }
    }

    if (ssid_.length() == 0 || password_.length() == 0) {
        Serial.println("No stored credentials");
        return false;
    }

    this->ssid = ssid_;
    this->password = password_;

    Serial.println("Found stored credentials");
    Serial.println(ssid_);
    Serial.println(password_);

    return true;
}

bool WiFiManager::storeWifiCredentials(const String& ssid,
                                       const String& password) {
    // Check if SSID and password lengths exceed the allocated space
    if (ssid.length() > (PASSWORD_START_ADDR - SSID_START_ADDR - 1) ||
        password.length() > (EEPROM_SIZE - PASSWORD_START_ADDR - 1)) {
        Serial.println("SSID or password is too long.");
        return false;
    }

    // Clear the previous SSID and password
    for (int i = SSID_START_ADDR; i < EEPROM_SIZE; i++) {
        EEPROM.write(i, 0);
    }

    // Write SSID to EEPROM
    for (int i = 0; i < ssid.length(); i++) {
        EEPROM.write(SSID_START_ADDR + i, ssid[i]);
    }
    // Write null terminator for SSID
    EEPROM.write(SSID_START_ADDR + ssid.length(), '\0');

    // Write password to EEPROM
    for (int i = 0; i < password.length(); i++) {
        EEPROM.write(PASSWORD_START_ADDR + i, password[i]);
    }
    // Write null terminator for password
    EEPROM.write(PASSWORD_START_ADDR + password.length(), '\0');

    // Commit changes to EEPROM
    if (!EEPROM.commit()) {
        Serial.println("Failed to commit to EEPROM.");
        return false;
    }

    // Read back the SSID and password
    String storedSSID = "";
    for (int i = SSID_START_ADDR; i < PASSWORD_START_ADDR; i++) {
        if (isAlphaNumeric(EEPROM.read(i))) {
            storedSSID += char(EEPROM.read(i));
        }
    }

    String storedPassword = "";
    for (int i = PASSWORD_START_ADDR; i < EEPROM_SIZE; i++) {
        if (isAlphaNumeric(EEPROM.read(i))) {
            storedPassword += char(EEPROM.read(i));
        }
    }

    // Check if the stored SSID and password match the input values
    if (storedSSID != ssid || storedPassword != password) {
        Serial.println("Failed to verify the stored SSID and password.");
        return false;
    }

    Serial.println("Successfully stored the SSID and password.");

    this->ssid = storedSSID;
    this->password = storedPassword;

    return true;
}

String WiFiManager::toStringIp(IPAddress ip) {
    String res = "";
    for (int i = 0; i < 3; i++) {
        res += String((ip >> (8 * i)) & 0xFF) + ".";
    }
    res += String(((ip >> 8 * 3)) & 0xFF);
    return res;
}

void WiFiManager::setWifiConnectionInfo() {
    // this->appConfig->wifiManager.ssid = WiFi.SSID();
    // this->appConfig->wifiManager.ip = WiFi.localIP();
    // this->appConfig->wifiManager.hostname = WiFi.hostname();
    // this->appConfig->wifiManager.gateway = WiFi.gatewayIP();
    // this->appConfig->wifiManager.subnet = WiFi.subnetMask();
    // this->appConfig->wifiManager.mac = WiFi.macAddress();
    // this->appConfig->wifiManager.rssi = WiFi.RSSI();
    // this->appConfig->wifiManager.channel = WiFi.channel();
}

bool WiFiManager::isConnected() { return WiFi.status() == WL_CONNECTED; }

wl_status_t WiFiManager::getStatus() { return WiFi.status(); }