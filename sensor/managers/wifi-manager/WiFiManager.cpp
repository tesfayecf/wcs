#include "WifiManager.h"

#include "../../App/AppConfig.h"
#include "../../misc/logger.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "WebPage.h"

WifiManager::WifiManager() : server(SERVER_PORT) {
  this->ssid = "";
  this->password = "";
}

void WifiManager::init() {
  Logger::notice("WifiManager::init()", "WifiManager initialized");
}

void WifiManager::setup() {
  // Start EEPROM memory
  Logger::notice("WifiManager::setup()", "WifiManager start setup");

  Logger::verbose("WifiManager::setup()", "EEPROM begin");
  EEPROM.begin(EEPROM_SIZE);

  // Connect to WiFi
  WiFi.enableInsecureWEP();
  if (!this->connect()) {
    Logger::warning("WifiManager::setup()", "WiFi connection failed");
    return;
  }

  Logger::notice("WifiManager::setup()", "WiFi finish set up");
}

void WifiManager::loop() {
  // Check if WiFi is connected and continue loop
  if (WiFi.status() != WL_CONNECTED) {
    this->connected = false;
    Logger::warning("WifiManager::loop()", "WiFi connection lost");
    this->connect();
    return;
  }
}

boolean WifiManager::connect() {
  Logger::notice("WifiManager::connect()", "Connecting to wifi");
  this->connecting = true;
  this->connected = false;
  if (this->readCredentials()) {
    if (this->startConnection()) {
      this->connected = true;
      this->connecting = false;
      this->setConnectionInfo();
      return true;
    }
  }
  return this->startConfigPortal();
}

boolean WifiManager::startConnection() {
  WiFi.mode(WIFI_STA);
  Logger::verbose("WifiManager::startConnection()", "Wifi mode set to STA");

  IPAddress IP(192, 168, 1, 101);
  IPAddress GATEWAY(192, 168, 1, 1);
  IPAddress SUBNET(255, 255, 0, 0);
  if (!WiFi.config(IP, GATEWAY, SUBNET)) {
    Logger::error("WifiManager::startConnection()", "Error configuring wifi");
    return false;
  }

  if (!WiFi.begin(this->ssid, this->password)) {
    Logger::error("WifiManager::startConnection()", "Error connecting to wifi");
    return false;
  }

  Logger::verbose("WifiManager::startConnection()", "WiFi status: " + String(WiFi.status()));
  int r = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    r++;
    Serial.print(".");
    if (r == 250) {
      Logger::error("WifiManager::startConnection()", "Connection timeout");
      Logger::verbose("WifiManager::startConnection()", "WiFi status: " + String(WiFi.status()));
      return false;
    };
  }

  Logger::verbose("WifiManager::startConnection()", "Wifi connected");
  return true;
}

void WifiManager::setConnectionInfo() {
  this->appConfig->wifiManager.ssid = WiFi.SSID();
  Logger::verbose("WifiManager::setConnectionInfo()", "SSID: " + WiFi.SSID());
  this->appConfig->wifiManager.ip = WiFi.localIP();
  Logger::verbose("WifiManager::setConnectionInfo()", "IP: " + WiFi.localIP().toString());
  this->appConfig->wifiManager.hostname = WiFi.hostname();
  Logger::verbose("WifiManager::setConnectionInfo()", "Hostname: " + WiFi.hostname());
  this->appConfig->wifiManager.gateway = WiFi.gatewayIP();
  Logger::verbose("WifiManager::setConnectionInfo()", "Gateway: " + WiFi.gatewayIP().toString());
  this->appConfig->wifiManager.subnet = WiFi.subnetMask();
  Logger::verbose("WifiManager::setConnectionInfo()", "Subnet: " + WiFi.subnetMask().toString());
  this->appConfig->wifiManager.mac = WiFi.macAddress();
  Logger::verbose("WifiManager::setConnectionInfo()", "MAC: " + WiFi.macAddress());
  this->appConfig->wifiManager.rssi = WiFi.RSSI();
  Logger::verbose("WifiManager::setConnectionInfo()", "RSSI: " + String(WiFi.RSSI()));
  this->appConfig->wifiManager.channel = WiFi.channel();
  Logger::verbose("WifiManager::setConnectionInfo()", "Channel: " + String(WiFi.channel()));
}

boolean WifiManager::startConfigPortal() {
  Logger::verbose("WifiManager::startConfigPortal()", "Start config portal");

  WiFi.mode(WIFI_OFF);
  delay(100);
  Logger::verbose("WifiManager::startConfigPortal()", "Wifi off");
  WiFi.mode(WIFI_AP_STA);
  Logger::verbose("WifiManager::startConfigPortal()", "Wifi AP STA");

  IPAddress APIP(172, 0, 0, 1);
  IPAddress APGATEWAY(172, 0, 0, 1);
  IPAddress APSUBNET(255, 255, 0, 0);
  if (!WiFi.softAPConfig(APIP, APGATEWAY, APSUBNET)) {
    return false;
  }

  String portalSSID = "WCS-sensor-" + String(ESP.getChipId()); // Get from appConfig
  Logger::notice("WifiManager::startConfigPortal()", "Portal SSID: " + portalSSID);

  DNSServer dnsServer;
  dnsServer.start(53, "*", APIP);  // DNS spoofing (Only for HTTP)
  Logger::verbose("WifiManager::startConfigPortal()", "DNS server started");

  WiFi.softAP(portalSSID);
  boolean res = WiFi.setHostname("WCS_config");
  Logger::verbose("WifiManager::startConfigPortal()", "Wifi AP started");

  server.on("/", HTTP_GET, [this]() { this->renderMainPage(); });
  server.on("/setCredentials", HTTP_POST, [this]() {this->getCredentials();});
  server.onNotFound([this]() { this->renderMainPage(); });

  server.begin();
  Logger::notice("WifiManager::startConfigPortal()", "Server started");

  while (WiFi.status() != WL_CONNECTED) {
    dnsServer.processNextRequest();
    server.handleClient();
    delay(10);
  }

  Logger::verbose("WifiManager::startConfigPortal()", "WiFi status: " + String(WiFi.status()));
  Logger::notice("WifiManager::startConfigPortal()", "Close config portal");
  return this->connected;
}

void WifiManager::renderMainPage() {
  String serverLoc = ipToString(server.client().localIP());
  Logger::verbose("WifiManager::renderMainPage()", "New connection - IP: " + serverLoc);
  boolean doRedirect = serverLoc != server.hostHeader();
  if (doRedirect) {
    server.sendHeader(F("Location"), (String)F("http://") + serverLoc, true);
    server.send(302, "text/plain", "");
    server.client().stop();
  }

  String mainPage = main_page;
  unsigned int fileSize = mainPage.length();
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Content-Length", String(fileSize));
  server.send(200, "text/html", mainPage);
}

boolean WifiManager::readCredentials() {
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
    Logger::notice("WifiManager::readCredentials()", "No stored credentials");
    return false;
  }

  this->ssid = ssid_;
  this->password = password_;

  Logger::notice("WifiManager::readCredentials()", "Found stored credentials");
  Logger::verbose("WifiManager::readCredentials()", "SSID: " + ssid_);
  Logger::verbose("WifiManager::readCredentials()", "Password: " + password_);
  return true;
}

boolean WifiManager::getCredentials() {
  String ssid = server.arg("ssid");
  String password = server.arg("password");
  Logger::notice("WifiManager::getCredentials()", "Received credentials");
  Logger::verbose("WifiManager::getCredentials()", "SSID: " + ssid);
  Logger::verbose("WifiManager::getCredentials()", "Password: " + password);
  if (this->storeCredentials(ssid, password)) {
    Logger::notice("WifiManager::getCredentials()", "Credentials stored");
    if (this->connect()) {
      Logger::notice("WifiManager::getCredentials()", "Connection successful");
      server.send(200, "text/html", "OK");
      return true;
    }
  }
  server.send(200, "text/html", "FAIL");
  Logger::error("WifiManager::getCredentials()", "Connection failed");
  return false;
}

boolean WifiManager::storeCredentials(const String& ssid, const String& password) {
  // Check if SSID and password lengths exceed the allocated space
  if (ssid.length() > (PASSWORD_START_ADDR - SSID_START_ADDR - 1)) {
    Logger::verbose("WifiManager::storeCredentials()", "SSID or password is too long.");
    return false;
  }

  if (password.length() > (EEPROM_SIZE - PASSWORD_START_ADDR - 1)) {
    Logger::verbose("WifiManager::storeCredentials()", "Password is too long.");
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
    Logger::error("WifiManager::storeCredentials()", "Failed to commit to EEPROM.");
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
    Logger::error("WifiManager::storeCredentials()", "Failed to verify the stored SSID and password.");
    return false;
  }

  Logger::verbose("WifiManager::storeCredentials()", "Successfully stored the SSID and password.");
  this->ssid = ssid;
  this->password = password;
  return true;
}

String WifiManager::ipToString(IPAddress ip) {
  String res = "";
  for (int i = 0; i < 3; i++) {
    res += String((ip >> (8 * i)) & 0xFF) + ".";
  }
  res += String(((ip >> 8 * 3)) & 0xFF);
  return res;
}