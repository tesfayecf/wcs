#include "PumpManager.h"

#include "../../utils/constants.h"

PumpManager::PumpManager(App& app) : appInstance(app) {}

void PumpManager::setup() {
    Serial.println("Initializing PumpManager");
    // // Set pin I/O
    pinMode(RELE_PIN, OUTPUT);

    pinMode(START_PIN, INPUT);
    pinMode(START_LED_PIN, OUTPUT);

    pinMode(STOP_PIN, INPUT);
    pinMode(STOP_LED_PIN, OUTPUT);

    // // Inicializar LEDs en apagado
    digitalWrite(RELE_PIN, LOW);
    digitalWrite(START_LED_PIN, LOW);
    digitalWrite(STOP_LED_PIN, LOW);
}

void PumpManager::loop() {
    int value;
    value = digitalRead(START_PIN);
    if (value == HIGH) {
        digitalWrite(STOP_LED_PIN, LOW);
        digitalWrite(START_LED_PIN, HIGH);
    } else if (value == LOW) {
        digitalWrite(STOP_LED_PIN, HIGH);
        digitalWrite(START_LED_PIN, LOW);
    }
}

// // if stop is not pressed and we press start, start the pump
// if (digitalRead(STOP_PIN) == LOW) {
//     if (digitalRead(START_PIN) == HIGH) {
//         digitalWrite(RELE_PIN, LOW);
//         digitalWrite(START_LED_PIN, LOW);
//         digitalWrite(STOP_LED_PIN, HIGH);
//     }
// }

// // if stop is pressed and we start is pressed, stop the pump
// if (digitalRead(STOP_PIN) == LOW) {
//     if (digitalRead(START_PIN) == LOW) {
//         digitalWrite(RELE_PIN, HIGH);
//         digitalWrite(START_LED_PIN, HIGH);
//         digitalWrite(STOP_LED_PIN, LOW);
//         delay(200);
//     }
// }

// // if stop is pressed and start is not pressed, reset the stop state
// if (digitalRead(STOP_PIN) == HIGH) {
//     if (digitalRead(START_PIN) == HIGH) {
//         digitalWrite(RELE_PIN, HIGH);
//         digitalWrite(START_LED_PIN, HIGH);
//         digitalWrite(STOP_LED_PIN, HIGH);
//     }
// }

// // Read button states
//     startButtonState = digitalRead(START_PIN);
//     stopButtonState = digitalRead(STOP_PIN);
//     unsigned long currentTime = millis();

//     // Check if the start button is pressed and handle debounce
//     if (startButtonState != prevStartButtonState) {
//         lastDebounceTime = currentTime;
//     }
//     if ((currentTime - lastDebounceTime) > DEBOUNCE_TIME) {
//         // If the button state has changed and is stable for a certain
//         time if (startButtonState == LOW && !prevStartButtonState) {
//             startButtonPressed = true;
//         }
//     }
//     prevStartButtonState = startButtonState;

//     // Check if the stop button is pressed and handle debounce
//     if (stopButtonState != prevStopButtonState) {
//         lastDebounceTime = currentTime;
//     }
//     if ((currentTime - lastDebounceTime) > DEBOUNCE_TIME) {
//         // If the button state has changed and is stable for a certain
//         time if (stopButtonState == LOW && !prevStopButtonState) {
//             stopButtonPressed = true;
//         }
//     }
//     prevStopButtonState = stopButtonState;

//     // Start the pump if stop is not pressed and start is pressed
//     if (stopButtonState == HIGH && startButtonPressed && !pumpActive) {
//         pumpActive = true;
//         digitalWrite(RELE_PIN, HIGH);
//         digitalWrite(START_LED_PIN, HIGH);
//         digitalWrite(STOP_LED_PIN, LOW);
//     }

//     // Stop the pump if stop is pressed and start is pressed
//     if (stopButtonState == HIGH && startButtonPressed && pumpActive) {
//         pumpActive = false;
//         digitalWrite(RELE_PIN, LOW);
//         digitalWrite(START_LED_PIN, LOW);
//         digitalWrite(STOP_LED_PIN, HIGH);
//         delay(200);
//     }

//     // Reset states if stop is pressed and start is not pressed
//     if (stopButtonState == LOW && startButtonPressed) {
//         pumpActive = false;
//         digitalWrite(RELE_PIN, HIGH);
//         digitalWrite(START_LED_PIN, HIGH);
//         digitalWrite(STOP_LED_PIN, HIGH);
//         startButtonPressed = false;
//         stopButtonPressed = false;
//     }