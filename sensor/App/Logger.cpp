#include "Logger.h"

#include "../../utils/types.h"

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

Logger::Logger(): _level(WARNING), _loggerOutputFunction(0) { }

void Logger::setLogLevel(LogLevel level) { getInstance()._level = level; }

LogLevel Logger::getLogLevel() { return getInstance()._level; }

void Logger::verbose(const char* message) { log(VERBOSE, message); }
void Logger::verbose(const String message) { log(VERBOSE, message); }
void Logger::verbose(const char* module, const char* message) { log(VERBOSE, module, message); }
void Logger::verbose(const String module, const String message) { log(VERBOSE, module, message); }

void Logger::notice(const char* module, const char* message) { log(NOTICE, module, message); }
void Logger::notice(const String module, const String message) { log(NOTICE, module, message); }
void Logger::notice(const char* message) { log(NOTICE, message); }
void Logger::notice(const String message) { log(NOTICE, message); }

void Logger::warning(const char* module, const char* message) { log(WARNING, module, message); }
void Logger::warning(const String module, const String message) { log(WARNING, module, message); }
void Logger::warning(const char* message) { log(WARNING, message); }
void Logger::warning(const String message) { log(WARNING, message); }

void Logger::error(const char* module, const char* message) { log(ERROR, module, message); }
void Logger::error(const String module, const String message) { log(ERROR, module, message); }
void Logger::error(const char* message) { log(ERROR, message); }
void Logger::error(const String message) { log(ERROR, message); }

void Logger::fatal(const char* module, const char* message) { log(FATAL, module, message); }
void Logger::fatal(const String module, const String message) { log(FATAL, module, message); }
void Logger::fatal(const char* message) { log(FATAL, message); }
void Logger::fatal(const String message) { log(FATAL, message); }

void Logger::log(LogLevel level, const char* message) { log(level, "", message); }
void Logger::log(LogLevel level, const String message) { log(level, "", message); }

void Logger::log(LogLevel level, const char* module, const char* message) {
    if (level >= getLogLevel()) {
        if (getInstance()._loggerOutputFunction) {
            getInstance()._loggerOutputFunction(level, module, message);
        }
        else {
            getInstance().defaultLog(level, module, message);
        }
    }
}

void Logger::log(LogLevel level, const String module, const String message) {
    log(level, module.c_str(), message.c_str());
}

void Logger::setOutputFunction(LoggerOutputFunction loggerOutputFunction) {
    getInstance()._loggerOutputFunction = loggerOutputFunction;
}

Logger& Logger::getInstance() {
    static Logger logger;
    return logger;
}

const char* Logger::asString(LogLevel level) { return LOG_LEVEL_STRINGS[level]; }

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
