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
constexpr char ACTION_PARAMS = 'p';
constexpr char ACTION_PARAMS_COUNT = 'c';

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
    const char* payload[5];
    size_t payload_count;
    MetaInfo meta_info;

    // // Constructors
    Message(ActionType at, RegisterAction ra, const char* p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.register_action = ra;
        setActionPayload(p, pc);
    }

    Message(ActionType at, DataAction da, const char* p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.data_action = da;
        setActionPayload(p, pc);
    }

    Message(ActionType at, CommandAction ca, const char* p[], size_t pc, MetaInfo m)
        : action_type(at), payload_count(pc), meta_info(m) {
        action_name.command_action = ca;
        setActionPayload(p, pc);
    }

    // Serialize MQTTMessage to JSON string
    void toJson(String& json_str) const {
        StaticJsonDocument<MQTT_MAX_PACKET_SIZE> jsonMessage;

        // Add action information
        JsonObject actionObject = jsonMessage.createNestedObject(MESSAGE_ACTION);
        actionObject[String(ACTION_TYPE)] = String(static_cast<char>(this->action_type));
        
        // Set the action name based on the action type
        switch (this->action_type) {
            case ActionType::Register:
                actionObject[String(ACTION_NAME)] = String(static_cast<char>(action_name.register_action));
                break;
            case ActionType::Data:
                actionObject[String(ACTION_NAME)] = String(static_cast<char>(action_name.data_action));
                break;
            case ActionType::Command:
                actionObject[String(ACTION_NAME)] = String(static_cast<char>(action_name.command_action));
                break;
        }

        // Add message body (payload)
        for (size_t i = 0; i < payload_count; i++) {
            char paramName[5];
            snprintf(paramName, sizeof(paramName), "p%zu", i);
            actionObject[String(paramName)] = String(payload[i]);
        }

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
            payload[payload_count++] = kv.value().as<const char*>();
        }

        // Parse sensor metadata
        JsonObject metaObject = jsonMessage[String(MESSAGE_META)];
        
        meta_info.message_id = metaObject[String(META_MESSAGE_ID)].as<String>();
        // strncpy(meta_info.message_id, metaObject[String(META_MESSAGE_ID)].as<const char*>(), sizeof(meta_info.message_id) - 1);
        // meta_info.message_id[sizeof(meta_info.message_id) - 1] = '\0';
        
        meta_info.timestamp = metaObject[String(META_TIMESTAMP)].as<unsigned long>();
        meta_info.sensor_time = metaObject[String(META_SENSOR_TIME)].as<unsigned long>();
        
        meta_info.version = metaObject[String(META_VERSION)].as<String>();
        // strncpy(meta_info.version, metaObject[String(META_VERSION)].as<const char*>(), sizeof(meta_info.version) - 1);
        // meta_info.version[sizeof(meta_info.version) - 1] = '\0';
        
        meta_info.sensor_id = metaObject[String(META_SENSOR_ID)].as<String>();
        // strncpy(meta_info.sensor_id, metaObject[String(META_SENSOR_ID)].as<const char*>(), sizeof(meta_info.sensor_id) - 1);
        // meta_info.sensor_id[sizeof(meta_info.sensor_id) - 1] = '\0';

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

    // Set the action payload and count
    void setActionPayload(const char* const p[], size_t pc) {
        this->payload_count = pc;
        for (size_t i = 0; i < pc && i < 5; i++) {
            this->payload[i] = p[i];
        }
    }
};

#endif  // MESSAGE_H