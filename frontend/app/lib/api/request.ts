'use server'
import { cookies, headers } from "next/headers";
import { apiInterface } from "./interface";
import { parseCookies } from "./cookies";
export interface ServerResponse<T> {
    data?: T;
    status: number;
    error?: any;
    errorText: string;
}

export async function serverRequest<
    T extends keyof typeof apiInterface,
    S extends keyof typeof apiInterface[T],
>(
    group: T,
    endpoint: S,
    // @ts-ignore
    args: typeof apiInterface[T][S]["args"],
    authenticate: boolean = true,
    // @ts-ignore
    customHeaders?: Record<string, string> = {},
    // @ts-ignore
): Promise<ServerResponse<typeof apiInterface[T][S]["data"]>> {
    const { endpoint: endpoint_, method: method_ } = apiInterface[group][endpoint as string];
    if (process.env.NODE_ENV === "development") console.log(`[${group}][${endpoint as string}] -> `, endpoint_);

    // Build headers object
    const requestHeaders = new Headers({
        "Content-Type": "application/json",
        ...customHeaders, // Merge custom headers
    });

    // Append cookies as Cookie headers 
    const sessionid = cookies().get("sessionid")?.value;
    if (sessionid) requestHeaders.append("Cookie", `sessionid=${sessionid};`);

    let response: Response;
    try {
        // Send request to server
        response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/${endpoint_}`,
            {
                method: method_,
                credentials: 'include',
                headers: requestHeaders,
                body: JSON.stringify(args),
                next: { tags: [endpoint as string] },
                referrer: headers().get("referer") || undefined,
            }
        );
    } catch (error) {
        // Catch request error
        console.error("Request failed:", error); // Log the error for debugging
        return {
            data: null,
            status: 500,
            error: error,
            errorText: "Internal Server Error",
        };
    }

    if (response.status > 199 && response.status < 300) {
        // Parse cookies
        const parsedCookies = parseCookies(response.headers.get("Set-Cookie") || "");

        // Store sessionid in cookies if exists (only login endpoint)
        if (parsedCookies["sessionid"]) {
            const sessionidAttributes = {
                expires: parsedCookies["sessionid"].attributes.expires || new Date(Date.now() + 60 * 60 * 1000).toUTCString(),
                path: parsedCookies["sessionid"].attributes.path || "/",
                samesite: parsedCookies["sessionid"].attributes.samesite || "strict",
                httponly: parsedCookies["sessionid"].attributes.httponly || false,
                secure: process.env.NODE_ENV !== "development",
            }
            await cookies().set({
                name: "sessionid",
                value: parsedCookies["sessionid"].value || "",
                // @ts-ignore
                cookie: {
                    ...sessionidAttributes
                }
            });
        }

        return {
            data: await response.json(),
            status: response.status,
            error: null,
            errorText: null,
        };
    } else {
        return {
            data: null,
            status: response.status,
            error: await response.json(),
            errorText: response.statusText,
        }
    }
}
