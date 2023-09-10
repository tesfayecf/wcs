'use client'

class LogHandler {
    private static instance: LogHandler;
    private constructor() {
        console.log("Log handler constructor");
    }

    public static getInstance(): LogHandler {
        if (!LogHandler.instance) {
            LogHandler.instance = new LogHandler();
        }
        return LogHandler.instance;
    }
}

export default LogHandler;