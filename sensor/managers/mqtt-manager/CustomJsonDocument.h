#include <Arduino.h>

class CustomJsonDocument {
private:
    static const size_t MAX_JSON_SIZE = 512; // Maximum size of the JSON string
    char jsonBuffer[MAX_JSON_SIZE]; // Buffer to hold the JSON string
    size_t jsonSize = 0; // Current size of the JSON string

public:
    // Add a key-value pair to the JSON document
    void add(const char* key, const char* value) {
        // Ensure we have enough space in the buffer
        if (jsonSize + strlen(key) + strlen(value) + 6 < MAX_JSON_SIZE) { // 6 for quotes, colon, and comma
            // Add the key-value pair to the JSON string
            if (jsonSize == 0) {
                snprintf(jsonBuffer + jsonSize, MAX_JSON_SIZE - jsonSize, "{\"%s\":\"%s\"", key, value);
            } else {
                snprintf(jsonBuffer + jsonSize, MAX_JSON_SIZE - jsonSize, ",\"%s\":\"%s\"", key, value);
            }
            jsonSize += strlen(jsonBuffer + jsonSize);
        } else {
            Serial.println("Error: Insufficient space to add key-value pair to JSON document");
        }
    }

    // Convert the JSON document to a JSON string
    const char* toJsonString() {
        if (jsonSize < MAX_JSON_SIZE - 1) { // Ensure there is space for null terminator
            snprintf(jsonBuffer + jsonSize, MAX_JSON_SIZE - jsonSize, "}");
            return jsonBuffer;
        } else {
            Serial.println("Error: Insufficient space to convert JSON document to JSON string");
            return nullptr;
        }
    }
};
