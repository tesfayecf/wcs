#include "JsonBuilder.h"
#include "../../utils/types.h"
#include "../../utils/utils.h"

JsonBuilder::JsonBuilder() : isFirstElement(true) {}

// Add a key-value pair to the JSON object
JsonBuilder& JsonBuilder::add(const char* key, const char* value) {
    if (!isFirstElement) {
        stream += ",";
    } else {
        isFirstElement = false;
    }

    stream += "\"" + String(key) + "\":";
    appendValue(value);

    return *this;
}

JsonBuilder& JsonBuilder::add(MESSAGE_PARAMETERS key, const char* value) {
    if (!isFirstElement) {
        stream += ",";
    } else {
        isFirstElement = false;
    }

    stream += "\"" + String(PARAM_TO_CHAR(key)) + "\":";
    appendValue(value);

    return *this;
}

// Add a nested JSON object
JsonBuilder& JsonBuilder::addObject(const char* key, const JsonBuilder& object) {
    if (!isFirstElement) {
        stream += ",";
    } else {
        isFirstElement = false;
    }

    stream += "\"" + String(key) + "\":" + object.getString();

    return *this;
}

JsonBuilder& JsonBuilder::addObject(MESSAGE_PARAMETERS key, const JsonBuilder& object) {
    if (!isFirstElement) {
        stream += ",";
    } else {
        isFirstElement = false;
    }

    stream += "\"" + String(PARAM_TO_CHAR(key)) + "\":" + object.getString();

    return *this;
}

// Convert the JsonBuilder to a JSON string
String JsonBuilder::getString() const {
    return "{" + stream + "}";
}

// Append a value to the JSON string
void JsonBuilder::appendValue(const char* value) {
    stream += "\"" + String(value) + "\"";
}
