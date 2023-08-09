#ifndef WEBSERVER_CONNECTION_MANAGER_H
#define WEBSERVER_CONNECTION_MANAGER_H
class App;  // Forward declaration of App

class WebServerManager {
   private:
    App& appInstance;

   public:
    WebServerManager(App& app);

    void init();
    void loop();
};

#include "WebServerManager.cpp"
#endif  // WEBSERVER_CONNECTION_MANAGER_H