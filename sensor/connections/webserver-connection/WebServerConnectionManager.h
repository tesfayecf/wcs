#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H
class App;  // Forward declaration of App

class WebServerConnectionManager {
   private:
    App& appInstance;

   public:
    WebServerConnectionManager(App& app);

    void init();
    void loop();
};

#include "WebServerConnectionManager.cpp"
#endif  // WEBSERVER_CONNECTION_MANAGER_H