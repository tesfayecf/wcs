#ifndef MQTT_CONNECTION_MANAGER_H
#define MQTT_CONNECTION_MANAGER_H

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"
#include "Arduino.h"

class MQTTManager {
 private:
  AppConfig* appConfig;
  Managers* managers;

  WiFiClient wifiClient;
  PubSubClient mqttClient;

 public:
  /**
   * @brief Constructor for the MQTTManager class.
   */
  MQTTManager();

  /**
   * @brief Initializes the MQTTManager.
   *
   * @param config_ Pointer to the AppConfig object.
   * @param managers_ Pointer to the Managers object.
   */
  void init(AppConfig* config_, Managers* managers_);

  /**
   * @brief Sets up the MQTT connection.
   */
  void setup();

  /**
   * @brief Main loop to handle MQTT events.
   */
  void loop();

  /**
   * @brief Subscribes to an MQTT topic.
   *
   * @param topic The topic to subscribe to.
   */
  void subscribe(const char* topic);

  /**
   * @brief Publishes sensor readings to the MQTT broker.
   *
   * @param readingRAW The raw reading value.
   * @param readingCM The reading value in centimeters.
   */
  void publishReadings(unsigned int readingRAW, unsigned int readingCM);

 private:
  static MQTTManager*
      instance;  // Static instance pointer for the callback function

  /**
   * @brief Connects to the MQTT broker.
   */
  void connect();

  /**
   * @brief Reconnects to the MQTT broker.
   */
  void reconnect();

  /**
   * @brief Publishes an MQTT message.
   *
   * @param dataObject The JSON object to publish.
   * @param topic The MQTT topic to publish to.
   */
  void basePublish(ArduinoJson::V6213PB2::JsonObject& dataObject,
                   const char* topic, bool meta = true);

  /**
   * @brief Adds metadata to the MQTT message.
   *
   * @param dataObject The JSON object to add metadata to.
   */
  void addMetadata(ArduinoJson::V6213PB2::JsonObject& dataObject);

  /**
   * @brief Callback function for handling received MQTT messages.
   *
   * @param topic The topic of the received message.
   * @param payload The payload of the received message.
   * @param length The length of the payload.
   */
  static void callbackFunction(char* topic, byte* payload, unsigned int length);

  /**
   * @brief Callback function for handling status messages.
   *
   * @param payload The payload of the status message.
   * @param length The length of the payload.
   */
  void statusCallback(uint8_t* payload, unsigned int length);

  /**
   * @brief Callback function for handling config messages.
   *
   * @param payload The payload of the config message.
   * @param length The length of the payload.
   */
  void configCallback(uint8_t* payload, unsigned int length);

  /**
   * @brief Callback function for handling register messages.
   *
   * @param payload The payload of the register message.
   * @param length The length of the payload.
   */
  void authCallback(uint8_t* payload, unsigned int length);

  void registerClient();

  void authenticateClient();

  /**
   * @brief Sets the MQTT connection information.
   */
  void setMqttConnectionInfo();
};

#endif  // MQTT_CONNECTION_MANAGER_H