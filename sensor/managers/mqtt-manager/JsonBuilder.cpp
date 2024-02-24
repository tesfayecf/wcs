// #include "JsonBuilder.h"
// #include "../../utils/types.h"
// #include "../../utils/utils.h"

// JsonBuilder::JsonBuilder(int initialCapacity) :
//     streamCapacity(initialCapacity),
//     streamLength(0),
//     isFirstElement(true)
// {
//     stream = new char[streamCapacity];
//     stream[0] = '\0';  // Initialize as empty string
// }

// // Add destructor
// JsonBuilder::~JsonBuilder() {
//     delete[] stream;
// }

// // Add a key-value pair to the JSON object
// JsonBuilder& JsonBuilder::add(const char* key, const char* value) {
//     if (!isFirstElement) {
//         stream += ",";
//     } else {
//         isFirstElement = false;
//     }

//     stream += "\"" + String(key) + "\":";
//     appendValue(value);
//     return *this;
// }

// JsonBuilder& JsonBuilder::add(MESSAGE_PARAMETERS key, const char* value) {
//     if (!isFirstElement) {
//         stream += ",";
//     } else {
//         isFirstElement = false;
//     }

//     stream += "\"" + String(PARAM_TO_CHAR(key)) + "\":";
//     appendValue(value);
//     return *this;
// }

// // Add a nested JSON object
// JsonBuilder& JsonBuilder::addObject(const char* key, const JsonBuilder& object) {
//     if (!isFirstElement) {
//         stream += ",";
//     } else {
//         isFirstElement = false;
//     }

//     stream += "\"" + String(key) + "\":" + object.toJson();
//     return *this;
// }

// JsonBuilder& JsonBuilder::addObject(MESSAGE_PARAMETERS key, const JsonBuilder& object) {
//     if (!isFirstElement) {
//         stream += ",";
//     } else {
//         isFirstElement = false;
//     }

//     stream += "\"" + String(PARAM_TO_CHAR(key)) + "\":" + object.toJson();
//     return *this;
// }

// // Convert the JsonBuilder to a JSON string
// String JsonBuilder::toJson() const {
//     return "{" + String(stream) + "}";
// }

// // Append a value to the JSON string
// void JsonBuilder::appendValue(const char* value) {
//     ensureCapacity(strlen(value) + 3);  // Account for quotes and null terminator
//     strcat(stream, "\"");
//     strcat(stream, value);
//     strcat(stream, "\"");
// }

// // Ensure sufficient capacity in the stream buffer
// void JsonBuilder::ensureCapacity(int additionalLength) {
//     if (streamLength + additionalLength + 1 > streamCapacity) {  // +1 for null terminator
//         // Double the capacity if needed
//         int newCapacity = streamCapacity * 2;
//         char* newStream = new char[newCapacity];
//         strcpy(newStream, stream);
//         delete[] stream;
//         stream = newStream;
//         streamCapacity = newCapacity;
//     }
// }