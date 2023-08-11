#include "PumpManager.h"

#include "utils/constants.h"

PumpManager::PumpManager() {}

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
    int start;
    int stop;
    start = digitalRead(START_PIN);
    stop = digitalRead(STOP_PIN);

    if (start != startButtonState) {
        if (start == HIGH) {
            if (!pumpActive) {
                digitalWrite(RELE_PIN, HIGH);
                pumpActive = true;
            }
            startButtonState = true;
        }
        if (start == LOW) {
            startButtonState = false;
        }
    }

    if (stop != stopButtonState) {
        if (stop == HIGH) {
            if (pumpActive) {
                digitalWrite(RELE_PIN, LOW);
                pumpActive = false;
            }
            stopButtonState = true;
        }

        if (stop == LOW) {
            stopButtonState = false;
        }
    }

    if (pumpActive) {
        digitalWrite(START_LED_PIN, HIGH);
        digitalWrite(STOP_LED_PIN, LOW);
    } else {
        if (stopButtonState) {
            digitalWrite(STOP_LED_PIN, HIGH);
        } else {
            digitalWrite(STOP_LED_PIN, LOW);
        }
        digitalWrite(START_LED_PIN, LOW);
    }
}

void PumpManager::turnOnPump() {
    if (!stopButtonState) {
        pumpActive = true;
    }
}
void PumpManager::turnOffPump() { pumpActive = false; }

bool PumpManager::getPumpStatus() { return pumpActive; }