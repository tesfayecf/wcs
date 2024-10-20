// Custom error class
class AppError extends Error {
    constructor(public action: string, public severity: string, message?: string) {
        super(message);
        this.name = "AppError";
    }
}

// Centralized error logging service with batching
const logQueue: any[] = []; // Queue for batching logs
const logErrorToServer = async () => {
    if (logQueue.length === 0) return; // No logs to send

    const maxRetries = 3;
    const errorDetails = logQueue.splice(0, logQueue.length); // Get all logs to send

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // await serverRequest("log", "error", { logs: errorDetails });
            return; // Exit if logging is successful
        } catch (logError) {
            console.error(`Attempt ${attempt} to log error failed:`, logError);
            if (attempt === maxRetries) {
                console.error("Max retries reached for logging error to server.");
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100)); // Exponential backoff
        }
    }
};

// Enhanced error handling function
const handleError = async (error: any, action: string, severity: string, additionalInfo?: any) => {
    console.error(`${action} error:`, error); // Log the error to the console

    // Prepare user context
    // const userContext = getUserContext(); // Get user context (e.g., user ID, roles)
    
    // Prepare error details
    const errorDetails = {
        action,
        message: error.message || "An error occurred",
        stack: error.stack || "No stack trace available",
        severity,
        additionalInfo, // Include any additional context
        // user: userContext, // Include user context
    };

    // Add error details to the log queue
    logQueue.push(errorDetails);
    await logErrorToServer(); // Attempt to log immediately

    return { success: false, message: `${action} failed`, error }; // Return a structured error response
};