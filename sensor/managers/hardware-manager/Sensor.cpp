// Sensor.cpp
#include "Sensor.h"

Sensor::Sensor(uint8_t trigPin, uint8_t echoPin, unsigned long timeOut) {
  trig = trigPin;
  echo = echoPin;
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  timeout = timeOut;
}

unsigned int Sensor::timing() {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  unsigned long startMicros = micros();
  while(!digitalRead(echo)) {
    if((micros() - startMicros) > timeout) {
      return 0; // Return 0 if timeout
    }
  }

  unsigned long echoStartMicros = micros();
  while(digitalRead(echo)) {
    if((micros() - echoStartMicros) > timeout) {
      return 0; // Return 0 if timeout
    }
  }

  return micros() - echoStartMicros; // duration
}

unsigned int Sensor::read() {
  return timing() / units / 2;  //distance by divisor
}

unsigned int Sensor::rawRead() {
  return timing() / 2;
}