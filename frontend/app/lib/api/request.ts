'use server'
import { cookies } from "next/headers";
import { apiInterface } from "./interface";
import { refresh, getTokens } from "../auth/actions";

export interface ServerResponse<T> {
    ok: boolean;
    status: number;
    statusText: string;
    error?: any;
    data?: T;
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

    if (process.env.NODE_ENV === "development") {
        console.log(`[${group}][${endpoint as string}] -> `, address);
    }

    const headers = new Headers({
        "Content-Type": "application/json",
    });

    if (authenticate) {
        const accesToken = cookies().get("access")?.value;
        const refreshToken = cookies().get("refresh")?.value;
        headers.append("Cookie", `access=${accesToken}; refresh=${refreshToken};`);
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/${address}`, {
            method,
            credentials: authenticate ? 'include' : "omit",
            headers,
            body: JSON.stringify(obj),
            next: { tags: [endpoint as string] },
        });

        const responseData = await response.json();

        if (response.ok) {
            return {
                ok: true,
                data: responseData,
                status: response.status,
                statusText: response.statusText,
            };
        } else {
            if (authenticate && response.status === 401) {
                // const refreshSuccessful = await refresh();
                // if (refreshSuccessful) return serverRequest(group, endpoint, args, authenticate);
            }

            return {
                ok: false,
                error: responseData,
                status: response.status,
                statusText: response.statusText,
            };
        }
    } catch (error) {
        console.error("Network error:", error);
        return {
            ok: false,
            error: "Network error occurred",
            status: 0,
            statusText: "Network Error",
        };
    }
}