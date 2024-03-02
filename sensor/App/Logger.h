#ifndef LOGGER_H
#define LOGGER_H

#include "../utils/types.h"

class Logger {
    private:
        Logger();
        Logger(const Logger&);
        void operator = (const Logger&);

        static void defaultLog(LogLevel level, const char* module, const char* message);

        LogLevel _level;
        
    public:
        typedef void (*LoggerOutputFunction)(LogLevel level, const char* module, const char* message);

        static Logger& getInstance();
        static void setOutputFunction(LoggerOutputFunction loggerOutputFunction);

        static void setLogLevel(LogLevel level);
        static LogLevel getLogLevel();

        static void verbose(const char* message);
        static void verbose(const String message);
        static void verbose(const char* module, const char* message);
        static void verbose(const String module, const String message);
        
        static void notice(const char* module, const char* message);
        static void notice(const String module, const String message);
        static void notice(const char* message);
        static void notice(const String message);

        static void warning(const char* module, const char* message);
        static void warning(const String module, const String message);
        static void warning(const char* message);
        static void warning(const String message);

        static void error(const char* module, const char* message);
        static void error(const String module, const String message);
        static void error(const char* message);
        static void error(const String message);

        static void fatal(const char* module, const char* message);
        static void fatal(const String module, const String message);
        static void fatal(const char* message);
        static void fatal(const String message);

        static void log(LogLevel level, const char* message);
        static void log(LogLevel level, const String message);
        static void log(LogLevel level, const char* module, const char* message);
        static void log(LogLevel level, const String module, const String message);

        static const char* asString(LogLevel level);

    private:
        LoggerOutputFunction _loggerOutputFunction;
};

#endif  // LOGGER_H