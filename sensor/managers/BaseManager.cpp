#include "BaseManager.h"

#include "../../utils/utils.h"

BaseManager::BaseManager() {}

void BaseManager::init_(App* app_, AppConfig* config_) {
    app = app_;
    appConfig = config_;

    // Call the virtual init function
    this->init();
}

void BaseManager::setup_() {
    blink(50);

    // Call the virtual setup function
    this->setup();
}

void BaseManager::loop_() {
    // TODO: call dogwatcher or something (logger) 
    blink(25);

    // Call the virtual loop function
    this->loop();
}