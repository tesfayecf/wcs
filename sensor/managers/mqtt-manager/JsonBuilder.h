// #ifndef JSON_BUILDER_H
// #define JSON_BUILDER_H

// #include "Arduino.h"
// #include "../../utils/types.h"

// class JsonBuilder {
//   public:
//     JsonBuilder(int initialCapacity = 256);  // Allow initial capacity specification
//     ~JsonBuilder();

//     // Add a key-value pair to the JSON object
//     JsonBuilder& add(const char* key, const char* value);
//     JsonBuilder& add(MESSAGE_PARAMETERS key, const char* value);

//     // Add a nested JSON object
//     JsonBuilder& addObject(const char* key, const JsonBuilder& object);
//     JsonBuilder& addObject(MESSAGE_PARAMETERS key, const JsonBuilder& object);

//     // Convert the JsonBuilder to a JSON string
//     String toJson() const;

//   private:
//     char* stream;
//     int streamCapacity;
//     int streamLength;
//     bool isFirstElement;

//     // Ensure sufficient capacity in the stream buffer
//     void ensureCapacity(int additionalLength);

//     // Append a value to the JSON string
//     void appendValue(const char* value);
// };

// #endif  // JSON_BUILDER_H

