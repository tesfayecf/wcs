import createHttpError, { HttpError } from "http-errors";
import { ValidationError } from "yup";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Method =
    | "GET"
    | "DELETE"
    | "HEAD"
    | "OPTIONS"
    | "POST"
    | "PUT"
    | "PATCH"
    | "PURGE"
    | "LINK"
    | "UNLINK";

// Shape of the response when an error is thrown
interface ErrorResponse {
    error: {
        message: string;
        err?: any; // Sent for unhandled errors resulting in 500
    };
    status?: number; // Sent for unhandled errors resulting in 500
}

type ApiMethodHandlers = {
    [key in Uppercase<Method>]?: NextApiHandler;
};

export function apiHandler(handler: ApiMethodHandlers): NextApiHandler {
    return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
        try {
            const method = req.method?.toUpperCase() as Uppercase<Method>;

            // check if handler supports current HTTP method
            if (!method) {
                throw new createHttpError.MethodNotAllowed(
                    `No method specified on path ${req.url}!`
                );
            }

            const methodHandler = handler[method];
            if (!methodHandler) {
                throw new createHttpError.MethodNotAllowed(
                    `Method ${req.method} Not Allowed on path ${req.url}!`
                );
            }

            // call method handler
            await methodHandler(req, res);
        } catch (err) {
            // global error handler
            errorHandler(err, res);
        }
    };
}

function errorHandler(
    err: any,
    res: NextApiResponse<ErrorResponse>
): void {
    if (createHttpError.isHttpError(err) && err.expose) {
        // Handle all errors thrown by http-errors module
        res.status(err.statusCode).json({ error: { message: err.message } });
    } else if (err instanceof ValidationError) {
        // Handle yup validation errors
        res.status(400).json({ error: { message: err.errors.join(", ") } });
    } else {
        // Default to 500 server error
        console.error(err);
        const status = createHttpError.isHttpError(err) ? err.statusCode : 500;
        res.status(status).json({
            error: { message: "Internal Server Error", err },
            status,
        });
    }
}
