// Sensor.h
#ifndef Sensor_h
#define Sensor_h

enum Units { CM = 28, INC = 71, MS = 1 };

class Sensor {
  public:
    Sensor(uint8_t trigPin, uint8_t echoPin, unsigned long timeOut = 20000UL);
    unsigned int read();
    void setTimeout(unsigned long timeOut) {timeout = timeOut;}
    void setUnits(Units units) {this->units = units;}

  private:
    uint8_t trig;
    uint8_t echo;
    unsigned long previousMicros;
    unsigned long timeout;
    Units units = CM;
    unsigned int timing();
};

#endif // Sensor_h