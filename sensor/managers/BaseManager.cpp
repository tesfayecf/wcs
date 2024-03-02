#include "BaseManager.h"

#include "../../utils/utils.h"

BaseManager::BaseManager() {}

void BaseManager::init_(App* app_, AppConfig* config_) {
    app = app_;
    appConfig = config_;
    Serial.println("BaseManager::init_");

    // Call the virtual init function
    this->init();
}

void BaseManager::setup_() {
    blink();
    // Call the virtual setup function
    this->setup();
}

void BaseManager::loop_() {
    // Call the virtual loop function
    this->loop();
}