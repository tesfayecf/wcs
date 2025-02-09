#ifndef UTILS_H
#define UTILS_H

#include "types.h"
#include "constants.h"

#include "../app/AppConfig.h"

/**
 * Function is used to generate a unique ID for each sensor.
 * Allows for an optional separator between boardId and flashChipId.
 */
inline String generateId(const String &boardId, const String &flashChipId) {
    if (boardId.isEmpty() || flashChipId.isEmpty()) {
        return "";
    }

    MD5Builder md5;
    md5.begin();
    md5.add(boardId);
    md5.add(flashChipId);
    md5.calculate();
    return md5.toString();
}

/**
 * Function to generate a random string with customizable character sets.
 * Parameters: 
 *  - length: Length of the random string.
 *  - useUppercase: Include uppercase letters.
 *  - useLowercase: Include lowercase letters.
 *  - useNumbers: Include numbers.
 *  - useSpecialChars: Include special characters.
 */
inline String generateRandomString(int length, bool useUppercase = true, bool useLowercase = true, bool useNumbers = true, bool useSpecialChars = false) {
    String randomString = "";
    String characters = "";

    if (useLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (useUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) characters += "0123456789";
    if (useSpecialChars) characters += "!@#$%^&*()-_=+[]{}|;:'\",.<>?/\\`~";

    if (characters.length() == 0) {
        return randomString;  // Return empty if no character set is selected
    }

    for (int i = 0; i < length; i++) {
        int randomIndex = random(characters.length());
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

/**
 * Function to format a byte array into a human-readable hex string.
 */
inline String byteArrayToHexString(const byte* byteArray, int length) {
    String hexString = "";
    for (int i = 0; i < length; i++) {
        if (byteArray[i] < 0x10) {
            hexString += "0";
        }
        hexString += String(byteArray[i], HEX);
    }
    return hexString;
}

/**
 * Function to convert a hex string to a byte array.
 */
inline void hexStringToByteArray(const String &hexString, byte* byteArray, int arraySize) {
    int len = hexString.length();
    int j = 0;

    for (int i = 0; i < len && j < arraySize; i += 2) {
        String byteString = hexString.substring(i, i + 2);
        byteArray[j++] = (byte) strtol(byteString.c_str(), NULL, 16);
    }
}

/**
 * Function to encode a string to Base64.
 * Ensures that the input is not empty.
 */
inline String base64Encode(const String &input) {
    if (input.isEmpty()) {
        return "";
    }

    const char base64Chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    int len = input.length();
    const byte *data = (const byte *)input.c_str();
    String encoded = "";

    for (int i = 0; i < len; i += 3) {
        int byte1 = data[i];
        int byte2 = (i + 1 < len) ? data[i + 1] : 0;
        int byte3 = (i + 2 < len) ? data[i + 2] : 0;

        int combined = (byte1 << 16) | (byte2 << 8) | byte3;

        encoded += base64Chars[(combined >> 18) & 0x3F];
        encoded += base64Chars[(combined >> 12) & 0x3F];
        encoded += (i + 1 < len) ? base64Chars[(combined >> 6) & 0x3F] : '=';
        encoded += (i + 2 < len) ? base64Chars[combined & 0x3F] : '=';
    }

    return encoded;
}

/**
 * Function to decode a Base64 encoded string.
 */
inline String base64Decode(const String &input) {
    if (input.isEmpty()) {
        return "";
    }

    const char base64Chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    int len = input.length();
    String decoded = "";
    byte data[3];
    int dataIndex = 0;
    int buffer = 0, bits = 0;

    for (int i = 0; i < len; i++) {
        if (input[i] == '=') break;

        int index = strchr(base64Chars, input[i]) - base64Chars;
        buffer = (buffer << 6) | index;
        bits += 6;

        if (bits >= 8) {
            bits -= 8;
            data[dataIndex++] = (buffer >> bits) & 0xFF;
            if (dataIndex == 3) {
                // decoded += String((char*)data, 3);
                decoded += byteArrayToHexString(data, 3);
                dataIndex = 0;
            }
        }
    }

    if (dataIndex > 0) {
        // decoded += String((char*)data, dataIndex);
        decoded += byteArrayToHexString(data, dataIndex);
    }

    return decoded;
}

/**
 * Function used to blink the built-in LED with custom patterns.
 * Parameters:
 *  - time: Duration of each blink in milliseconds.
 *  - count: Number of blinks.
 *  - pause: Time between each blink in milliseconds.
 */
inline void blink(int time, int count = 1, int pause = 100) {
    for (int i = 0; i < count; i++) {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(time);
        digitalWrite(LED_BUILTIN, LOW);
        if (i < count - 1) {
            delay(pause);
        }
    }
}

#endif  // UTILS_H