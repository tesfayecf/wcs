#ifndef BASE_MANAGER_H
#define BASE_MANAGER_H

#include "../app/AppConfig.h"

class App;

class BaseManager {
    public:
        App* app;
        AppConfig* appConfig;

    public:
        // Constructor
        BaseManager();

        // Initialize manager
        void init_(App* app_, AppConfig* config_);
        void setup_();
        void loop_();

        virtual void init() = 0;
        virtual void setup() = 0;
        virtual void loop() = 0;
};

#endif  // BASE_MANAGER_H