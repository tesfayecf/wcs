'use server'
import { cookies, headers } from "next/headers";
import { apiInterface } from "./interface";
import { parseCookies } from "./cookies";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
export interface ServerResponse<T> {
    statusCode: number;
    data?: T;
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
    args: Parameters<typeof apiInterface[T][S]["args"]>,
    authenticate: boolean = true,
    // @ts-ignore
): Promise<ServerResponse<ReturnType<typeof apiInterface[T][S]["args"]>>> {
    const { address, method, argsKeys } = apiInterface[group][endpoint as string];
    const obj = Object.fromEntries(argsKeys.map((key, index) => [key, args[index]]));
    if (process.env.NODE_ENV === "development") console.log(`[${group}][${endpoint as string}] -> `, address);

    // Build headers object
    const requestHeaders = new Headers({
        "Content-Type": "application/json",
    });

    // Append cookies as set cookies headers 
    const sessionid = cookies().get("sessionid")?.value;
    if (sessionid) requestHeaders.append("Cookie", `sessionid=${sessionid};`);

    let response: Response;
    try {
        // Send request to server
        response = await fetch(`http://127.0.0.1:8000/${address}`, // TODO: use environment variable
            {
                method,
                credentials: 'include',
                headers: requestHeaders,
                body: JSON.stringify(obj),
                next: { tags: [endpoint as string] },
                referrer: headers().get("referer") || undefined,
            }
        );
    } catch (error) {
        // Catch request error
        return {
            data: null,
            error: error,
            statusCode: 500,
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
            statusCode: response.status,
            error: null,
            errorText: null,
        };
    } else {
        return {
            data: null,
            error: await response.json(),
            statusCode: response.status,
            errorText: response.statusText,
        }
    }
}