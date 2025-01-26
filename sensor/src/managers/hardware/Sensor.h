#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

/**
 * @enum Units
 * @brief Represents the different units of measurement that the sensor can use.
 * - CM: Centimeters (default)
 * - INC: Inches
 * - MS: Milliseconds
 */
enum Units { 
    CM = 28,   ///< Centimeters: 1 CM corresponds to 28 microseconds.
    INC = 71,  ///< Inches: 1 Inch corresponds to 71 microseconds.
    MS = 1     ///< Milliseconds: 1 Millisecond corresponds to 1 microsecond.
};

/**
 * @class Sensor
 * @brief A class to represent an ultrasonic sensor, typically used for distance measurement.
 * 
 * This class allows you to measure the distance to an object using an ultrasonic sensor.
 * The sensor works by sending a sound pulse and measuring the time it takes for the echo to return.
 * The distance can then be calculated based on the speed of sound.
 */
class Sensor {
public:
    /**
     * @brief Constructor for the Sensor class.
     * 
     * Initializes the sensor with the provided trigger and echo pins, and an optional timeout value.
     * 
     * @param trigPin The pin number connected to the trigger pin of the sensor.
     * @param echoPin The pin number connected to the echo pin of the sensor.
     * @param timeOut The maximum time to wait for an echo (in microseconds). Default is 20,000 microseconds.
     */
    Sensor(uint8_t trigPin, uint8_t echoPin, unsigned long timeOut = 20000UL) 
        : trig(trigPin), echo(echoPin), timeout(timeOut), units(CM) {
        pinMode(trig, OUTPUT);
        pinMode(echo, INPUT);
    }

    /**
     * @brief Measures the distance to an object.
     * 
     * This function triggers the sensor and calculates the distance based on the time taken
     * for the echo to return. The distance is measured in the units set by setUnits().
     * 
     * @return The measured distance in the current units.
     */
    unsigned int read() {
        return timing() / units;
    }

    /**
     * @brief Sets the timeout for the sensor.
     * 
     * This function sets the maximum time to wait for an echo response from the sensor.
     * 
     * @param timeOut The timeout duration in microseconds.
     */
    void setTimeout(unsigned long timeOut) {
        timeout = timeOut;
    }

    /**
     * @brief Sets the units for distance measurement.
     * 
     * This function allows you to set the unit of measurement for the distance returned by the read() function.
     * 
     * @param units The units to use (CM, INC, or MS).
     */
    void setUnits(Units units) {
        this->units = units;
    }

private:
    uint8_t trig;            ///< The pin number connected to the trigger pin of the sensor.
    uint8_t echo;            ///< The pin number connected to the echo pin of the sensor.
    unsigned long timeout;   ///< Maximum time to wait for an echo response (in microseconds).
    Units units;             ///< The units of measurement for distance (default is centimeters).

    /**
     * @brief Measures the time taken for the echo to return.
     * 
     * This function sends a pulse from the trigger pin, waits for the echo to be received on the echo pin,
     * and measures the time taken for the echo to return.
     * 
     * @return The duration in microseconds for the echo to return. Returns 0 if the timeout is reached.
     */
    unsigned int timing() {
        // Send a pulse from the trigger pin
        digitalWrite(trig, LOW);
        delayMicroseconds(2);
        digitalWrite(trig, HIGH);
        delayMicroseconds(10);
        digitalWrite(trig, LOW);

        // Wait for the echo to start
        unsigned long startMicros = micros();
        while (!digitalRead(echo)) {
            if ((micros() - startMicros) > timeout) {
                return 0; // Return 0 if timeout is reached
            }
        }

        // Measure the duration of the echo pulse
        unsigned long echoStartMicros = micros();
        while (digitalRead(echo)) {
            if ((micros() - echoStartMicros) > timeout) {
                return 0; // Return 0 if timeout is reached
            }
        }

        return micros() - echoStartMicros; // Return the duration of the echo pulse
    }
};

#endif // SENSOR_H