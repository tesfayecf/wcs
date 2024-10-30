#ifndef MESSAGE_H
#define MESSAGE_H

#include <ArduinoJson.h>

#include "../../misc/logger.h"
#include "../../utils/constants.h"
#include "../../utils/utils.h"

constexpr char MESSAGE_ACTION = 'a';
constexpr char MESSAGE_META = 'm';

constexpr char ACTION_TYPE = 't';
constexpr char ACTION_NAME = 'n';
constexpr char ACTION_PAYLOAD = 'p';
constexpr char ACTION_PAYLOAD_COUNT = 'c';

constexpr char ACTION_REGISTER = 'r';
constexpr char ACTION_REGISTER_SENSOR = 'n';
constexpr char ACTION_REGISTER_UPDATE_SENSOR = 'u';
constexpr char ACTION_REGISTER_REMOVE_SENSOR = 'x';

constexpr char ACTION_DATA = 'd';
constexpr char ACTION_DATA_SENSOR_READING = 's';
constexpr char ACTION_DATA_BATCH_READINGS = 'b';
constexpr char ACTION_DATA_ERROR_REPORT = 'e';

constexpr char ACTION_COMMAND = 'c';
constexpr char ACTION_COMMAND_SET_INTERVAL = 'i';
constexpr char ACTION_COMMAND_CALIBRATE = 'k';
constexpr char ACTION_COMMAND_UPDATE_FIRMWARE = 'f';
constexpr char ACTION_COMMAND_RESET = 'r';

constexpr char META_MESSAGE_ID = 'm';
constexpr char META_TIMESTAMP = 't';
constexpr char META_SENSOR_TIME = 's';
constexpr char META_VERSION = 'v';
constexpr char META_SENSOR_ID = 'i';

enum class ActionType : char {
    Register = ACTION_REGISTER,
    Data = ACTION_DATA,
    Command = ACTION_COMMAND
};

enum class RegisterAction : char {
    Sensor = ACTION_REGISTER_SENSOR,
    UpdateSensor = ACTION_REGISTER_UPDATE_SENSOR,
    RemoveSensor = ACTION_REGISTER_REMOVE_SENSOR
};

enum class DataAction : char {
    SensorReading = ACTION_DATA_SENSOR_READING,
    BatchReadings = ACTION_DATA_BATCH_READINGS,
    ErrorReport = ACTION_DATA_ERROR_REPORT
};

enum class CommandAction : char {
    SetInterval = ACTION_COMMAND_SET_INTERVAL,
    Calibrate = ACTION_COMMAND_CALIBRATE,
    UpdateFirmware = ACTION_COMMAND_UPDATE_FIRMWARE,
    Reset = ACTION_COMMAND_RESET
};

// Metadata structure
struct MetaInfo {
    String message_id; // Message ID of lenght 24 + \0
    unsigned long timestamp; // 32 bits (0 to 4,294,967,295)
    unsigned long sensor_time; // 32 bits (0 to 4,294,967,295) 
    String version; // I.e. xx.xx.xx + \0
    String sensor_id; // Sensor ID of lenght 24 + \0
};

class Message {
public:
    ActionType action_type;
    union ActionName {
        RegisterAction register_action;
        DataAction data_action;
        CommandAction command_action;
    } action_name;
    String payload[5];
    size_t payload_count;
    MetaInfo meta_info;

    // // Constructors
    Message(ActionType at, RegisterAction ra, String p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.register_action = ra;
        setActionPayload(p, pc);
    }

    Message(ActionType at, DataAction da, String p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.data_action = da;
        setActionPayload(p, pc);
    }

    Message(ActionType at, CommandAction ca, String p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.command_action = ca;
        setActionPayload(p, pc);
    }

    // Serialize MQTTMessage to JSON string
    void toJson(String& json_str) const {
        // StaticJsonDocument<MQTT_MAX_PACKET_SIZE> jsonMessage;

        const size_t capacity = JSON_OBJECT_SIZE(2) + // Main object
                        JSON_OBJECT_SIZE(3) + // Action object
                        JSON_ARRAY_SIZE(payload_count) + // Payload array
                        JSON_OBJECT_SIZE(5) + // Meta object
                        200; // Extra space for strings and misc

        DynamicJsonDocument jsonMessage(capacity);

        // Add action information
        JsonObject actionObject = jsonMessage.createNestedObject(MESSAGE_ACTION);
        actionObject[String(ACTION_TYPE)] = this->getActionTypeChar();
        
        // Set the action name based on the action type
        switch (this->action_type) {
            case ActionType::Register:
                actionObject[String(ACTION_NAME)] = this->getActionNameChar();
                break;
            case ActionType::Data:
                actionObject[String(ACTION_NAME)] =  this->getActionNameChar();
                break;
            case ActionType::Command:
                actionObject[String(ACTION_NAME)] =  this->getActionNameChar();
                break;
        }

        // // Add message body (payload)
        // JsonObject payloadObject = jsonMessage.createNestedObject("payload");
        // for (size_t i = 0; i < payload_count; i++) {
        //     // Use snprintf to generate unique keys for the payload array
        //     char paramName[8];
        //     snprintf(paramName, sizeof(paramName), "p%zu", i);
        //     payloadObject[String(paramName)] = payload[i];
        // }

        // Create a JSON string from the payload array
        StaticJsonDocument<512> payloadDoc; // Adjust size as needed
        JsonArray payloadArray = payloadDoc.to<JsonArray>();
        for (size_t i = 0; i < payload_count; i++) {
            payloadArray.add(payload[i]);
        }
        String payloadJsonStr;
        serializeJson(payloadDoc, payloadJsonStr);
        // Add the payload JSON string to the main message
        actionObject[String(ACTION_PAYLOAD)] = payloadJsonStr;

        // Add meta information
        JsonObject metaObject = jsonMessage.createNestedObject(MESSAGE_META);
        metaObject[String(META_MESSAGE_ID)] = meta_info.message_id;
        metaObject[String(META_TIMESTAMP)] = meta_info.timestamp;
        metaObject[String(META_SENSOR_TIME)] = meta_info.sensor_time;
        metaObject[String(META_VERSION)] = meta_info.version;
        metaObject[String(META_SENSOR_ID)] = meta_info.sensor_id;

        // Serialize JSON to a string
        serializeJson(jsonMessage, json_str);
    }

    void toJsonManual(String& json_str) const {
        json_str = "{";
        // Add action information
        json_str += "\"" + String(MESSAGE_ACTION) + "\":{";
        // Set the action type
        json_str += "\"" + String(ACTION_TYPE) + "\":\"" + this->getActionTypeChar() + "\",";
        // Set the action name based on the action type
        json_str += "\"" + String(ACTION_NAME) + "\":\"" + this->getActionNameChar() + "\",";
        // Set the action payload
        json_str += "\"" + String(ACTION_PAYLOAD) + "\":[";
        for (size_t i = 0; i < payload_count; i++) {
            json_str += "\"" + payload[i] + "\"";
            if (i < payload_count - 1) {
                json_str += ",";
            }
        }
        json_str += "],";
        // Set the action payload count
        json_str += "\"" + String(ACTION_PAYLOAD_COUNT) + "\":" + String(payload_count) + "},";
        // Add meta information
        json_str += "\"" + String(MESSAGE_META) + "\":{";
        json_str += "\"" + String(META_MESSAGE_ID) + "\":\"" + meta_info.message_id + "\",";
        json_str += "\"" + String(META_TIMESTAMP) + "\":" + String(meta_info.timestamp) + ",";
        json_str += "\"" + String(META_SENSOR_TIME) + "\":" + String(meta_info.sensor_time) + ",";
        json_str += "\"" + String(META_VERSION) + "\":\"" + meta_info.version + "\",";
        json_str += "\"" + String(META_SENSOR_ID) + "\":\"" + meta_info.sensor_id + "\"";
        json_str += "}}";
    }

    // Deserialize JSON string to MQTTMessage
    bool fromJson(const String& json_str) {
        StaticJsonDocument<MQTT_MAX_PACKET_SIZE> jsonMessage;
        DeserializationError error = deserializeJson(jsonMessage, json_str);

        if (error) {
            Logger::error("Message::fromJson", "Failed to parse MQTT message");
            return false;
        }

        // Parse action information
        JsonObject actionObject = jsonMessage[MESSAGE_ACTION];
        setActionType(actionObject[String(ACTION_TYPE)].as<const char*>());
        setActionName(actionObject[String(ACTION_NAME)].as<const char*>());

        // Parse payload array
        payload_count = 0;
        for (JsonPair kv : actionObject) {
            payload[payload_count++] = kv.value().as<String>();
        }

        // Parse sensor metadata
        JsonObject metaObject = jsonMessage[String(MESSAGE_META)];
        meta_info.message_id = metaObject[String(META_MESSAGE_ID)].as<String>();
        meta_info.timestamp = metaObject[String(META_TIMESTAMP)].as<unsigned long>();
        meta_info.sensor_time = metaObject[String(META_SENSOR_TIME)].as<unsigned long>();
        meta_info.version = metaObject[String(META_VERSION)].as<String>();
        meta_info.sensor_id = metaObject[String(META_SENSOR_ID)].as<String>();

        return true;
    }

private:
    // Convert action type character to ActionType enum
    void setActionType(const char* action_type_char) {
        if (action_type_char != nullptr && strlen(action_type_char) == 1) {
            switch (action_type_char[0]) {  // Index the first character
                case 'r': this->action_type = ActionType::Register; break;
                case 'd': this->action_type = ActionType::Data; break;
                case 'c': this->action_type = ActionType::Command; break;
                default: Logger::error("Message::setActionType", "Unknown action type character"); break;
            }
        } else {
            Logger::error("Message::setActionType", "Invalid action type character");
        }
    }

    // Get the action type character based on the ActionType enum
    const char* getActionTypeChar() const {
        switch (this->action_type) {
            case ActionType::Register: return "r";
            case ActionType::Data: return "d";
            case ActionType::Command: return "c";
            default: return "-";
        }
    }

    // Set the appropriate action enum based on the action type and character
    void setActionName(const char* action_char) {
        if (action_char != nullptr && strlen(action_char) == 1) {
            switch (this->action_type) {
                case ActionType::Register:
                    switch (action_char[0]) {  // Index the first character
                        case 'n': this->action_name.register_action = RegisterAction::Sensor; break;
                        case 'u': this->action_name.register_action = RegisterAction::UpdateSensor; break;
                        case 'x': this->action_name.register_action = RegisterAction::RemoveSensor; break;
                        default: Logger::error("Message::setActionName", "Unknown register action character"); break;
                    }
                    break;
                case ActionType::Data:
                    switch (action_char[0]) {  // Index the first character
                        case 's': this->action_name.data_action = DataAction::SensorReading; break;
                        case 'b': this->action_name.data_action = DataAction::BatchReadings; break;
                        case 'e': this->action_name.data_action = DataAction::ErrorReport; break;
                        default: Logger::error("Message::setActionName", "Unknown data action character"); break;
                    }
                    break;
                case ActionType::Command:
                    switch (action_char[0]) {  // Index the first character
                        case 'i': this->action_name.command_action = CommandAction::SetInterval; break;
                        case 'k': this->action_name.command_action = CommandAction::Calibrate; break;
                        case 'f': this->action_name.command_action = CommandAction::UpdateFirmware; break;
                        case 'r': this->action_name.command_action = CommandAction::Reset; break;
                        default: Logger::error("Message::setActionName", "Unknown command action character"); break;
                    }
                    break;
                default: Logger::error("Message::setActionName", "Unknown action type in setActionName"); break;
            }
        } else {
            Logger::error("Message::setActionName", "Invalid action name character");
        }
    }

    // Get the action name character based on the ActionType and ActionName enums
    const char* getActionNameChar() const {
        switch (this->action_type) {
            case ActionType::Register:
                switch (this->action_name.register_action) {
                    case RegisterAction::Sensor: return "n";
                    case RegisterAction::UpdateSensor: return "u";
                    case RegisterAction::RemoveSensor: return "x";
                    default: return "-";
                }
            case ActionType::Data:
                switch (this->action_name.data_action) {
                    case DataAction::SensorReading: return "s";
                    case DataAction::BatchReadings: return "b";
                    case DataAction::ErrorReport: return "e";
                    default: return "-";
                }
            case ActionType::Command:
                switch (this->action_name.command_action) {
                    case CommandAction::SetInterval: return "i";
                    case CommandAction::Calibrate: return "k";
                    case CommandAction::UpdateFirmware: return "f";
                    case CommandAction::Reset: return "r";
                    default: return "-";
                }
            default: return "-";
        }
    }

    // Set the action payload and count
    void setActionPayload(String p[], size_t pc) {
        this->payload_count = pc;
        for (size_t i = 0; i < pc && i < 5; i++) {
            this->payload[i] = p[i];
        }
    }
};

#endif  // MESSAGE_H