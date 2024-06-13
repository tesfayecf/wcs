#ifndef LOGGER_H
#define LOGGER_H

#include "../utils/types.h"
#include <Arduino.h>

const char LEVEL_VERBOSE[] = "VERBOSE";
const char LEVEL_NOTICE[] = "NOTICE";
const char LEVEL_WARNING[] = "WARNING";
const char LEVEL_ERROR[] = "ERROR";
const char LEVEL_FATAL[] = "FATAL";
const char LEVEL_SILENT[] = "SILENT";

const char* const LOG_LEVEL_STRINGS[] = {
    LEVEL_VERBOSE,
    LEVEL_NOTICE,
    LEVEL_WARNING,
    LEVEL_ERROR,
    LEVEL_FATAL,
    LEVEL_SILENT
};

class Logger {
    private:
        Logger() : _level(WARNING), _loggerOutputFunction(nullptr) { }
        Logger(const Logger&) = delete;
        void operator=(const Logger&) = delete;

        static void defaultLog(LogLevel level, const char* module, const char* message);

        LogLevel _level;

    public:
        typedef void (*LoggerOutputFunction)(LogLevel level, const char* module, const char* message);

        static Logger& getInstance() {
            static Logger logger;
            return logger;
        }

        static void setOutputFunction(LoggerOutputFunction loggerOutputFunction) {
            getInstance()._loggerOutputFunction = loggerOutputFunction;
        }

        static void setLogLevel(LogLevel level) {
            getInstance()._level = level;
        }

        static LogLevel getLogLevel() {
            return getInstance()._level;
        }

        static void verbose(const char* message) {
            log(VERBOSE, message);
        }
        static void verbose(const String message) {
            log(VERBOSE, message);
        }
        static void verbose(const char* module, const char* message) {
            log(VERBOSE, module, message);
        }
        static void verbose(const String module, const String message) {
            log(VERBOSE, module, message);
        }

        static void notice(const char* module, const char* message) {
            log(NOTICE, module, message);
        }
        static void notice(const String module, const String message) {
            log(NOTICE, module, message);
        }
        static void notice(const char* message) {
            log(NOTICE, message);
        }
        static void notice(const String message) {
            log(NOTICE, message);
        }

        static void warning(const char* module, const char* message) {
            log(WARNING, module, message);
        }
        static void warning(const String module, const String message) {
            log(WARNING, module, message);
        }
        static void warning(const char* message) {
            log(WARNING, message);
        }
        static void warning(const String message) {
            log(WARNING, message);
        }

        static void error(const char* module, const char* message) {
            log(ERROR, module, message);
        }
        static void error(const String module, const String message) {
            log(ERROR, module, message);
        }
        static void error(const char* message) {
            log(ERROR, message);
        }
        static void error(const String message) {
            log(ERROR, message);
        }

        static void fatal(const char* module, const char* message) {
            log(FATAL, module, message);
        }
        static void fatal(const String module, const String message) {
            log(FATAL, module, message);
        }
        static void fatal(const char* message) {
            log(FATAL, message);
        }
        static void fatal(const String message) {
            log(FATAL, message);
        }

        static void log(LogLevel level, const char* message) {
            log(level, "", message);
        }
        static void log(LogLevel level, const String message) {
            log(level, "", message);
        }

        static void log(LogLevel level, const char* module, const char* message) {
            if (level >= getLogLevel()) {
                if (getInstance()._loggerOutputFunction) {
                    getInstance()._loggerOutputFunction(level, module, message);
                } else {
                    getInstance().defaultLog(level, module, message);
                }
            }
        }

        static void log(LogLevel level, const String module, const String message) {
            log(level, module.c_str(), message.c_str());
        }

        static const char* asString(LogLevel level) {
            return LOG_LEVEL_STRINGS[level];
        }
    
    private:
        LoggerOutputFunction _loggerOutputFunction;

};

void Logger::defaultLog(LogLevel level, const char* module, const char* message) {
    Serial.print(F("["));
    Serial.print(asString(level));
    Serial.print(F("] "));
    if (strlen(module) > 0) {
        Serial.print(F(": "));
        Serial.print(module);
        Serial.print(F(" "));
    }
    Serial.println(message);
}

#endif // LOGGER_H
