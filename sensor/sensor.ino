// // E8:9F:6D:93:59:B3 wemos d1 r2 base64: RTg6OUY6NkQ6OTM6NTk6QjM=
// // 48:55:19:C8:87:7A wemos d1 mini base64: NDg6NTU6MTk6Qzg6ODc6N0E=

#include "App/App.cpp"
#include "App/App.h"
#include "utils/AppConfig.h"
#include "utils/types.h"

AppConfig appConfig;
App app(appConfig);

void setup() {
  Serial.begin(115200);
  app.setup();
}

void loop() { app.loop(); }

/*
Give a clear response to this issue pointing to the specific files that
should be modified. Give the corrected code and explain the problem and the
solution. Also give multiple solutions to the problem and explain why i
should use one instead of another
*/

/*
Take into account that you are a senior programmer with years of experience in
embedded systems and app development. Give clear and concise explanation of the
problem and the solutions you apply pointing to the reasons why it is the best
option and apply best practices
*/
