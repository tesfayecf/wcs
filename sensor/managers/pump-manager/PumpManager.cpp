#include "PumpManager.h"

#include "../../utils/AppConfig.h"
#include "../../utils/constants.h"
#include "../../utils/types.h"

PumpManager::PumpManager() {}

void PumpManager::init(AppConfig* config_, Managers* managers_) {
    Serial.println("PumpManager init");
    managers = managers_;
    appConfig = config_;
}

bool PumpManager::pumpActive = false;
bool PumpManager::startButtonState = false;
bool PumpManager::stopButtonState = false;

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

    if (start != PumpManager::startButtonState) {
        if (start == HIGH) {
            if (!PumpManager::pumpActive) {
                digitalWrite(RELE_PIN, HIGH);
                PumpManager::pumpActive = true;
            }
            PumpManager::startButtonState = true;
        }
        if (start == LOW) {
            PumpManager::startButtonState = false;
        }
    }

    if (stop != PumpManager::stopButtonState) {
        if (stop == HIGH) {
            if (pumpActive) {
                digitalWrite(RELE_PIN, LOW);
                pumpActive = false;
            }
            PumpManager::stopButtonState = true;
        }

        if (stop == LOW) {
            PumpManager::stopButtonState = false;
        }
    }

    if (pumpActive) {
        digitalWrite(START_LED_PIN, HIGH);
        digitalWrite(STOP_LED_PIN, LOW);
    } else {
        if (PumpManager::stopButtonState) {
            digitalWrite(STOP_LED_PIN, HIGH);
        } else {
            digitalWrite(STOP_LED_PIN, LOW);
        }
        digitalWrite(START_LED_PIN, LOW);
    }
}

void PumpManager::turnOnPump() {
    if (!PumpManager::stopButtonState) {
        PumpManager::pumpActive = true;
        digitalWrite(RELE_PIN, HIGH);
    }
}
void PumpManager::turnOffPump() {
    PumpManager::pumpActive = false;
    digitalWrite(RELE_PIN, LOW);
}

bool PumpManager::getPumpStatus() { return PumpManager::pumpActive; }