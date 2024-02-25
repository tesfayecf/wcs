'use server'

import { cookies } from "next/headers";
import { apiInterface } from "./interface";

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
    // @ts-ignore
    const { address, method, argsKeys } = apiInterface[group][endpoint as string];
    const obj = Object.fromEntries(args.map((key, index) => [argsKeys[index], key]));
    if (process.env.NODE_ENV === "development") {
        console.log(`[${group}][${endpoint as string}] -> request`, address);
    }
    // Construct headers
    const accesToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (authenticate) headers.append("Cookie", `acces=${accesToken};`);
    if (authenticate) headers.append("Cookie", `refresh=${refreshToken};`);
    // Send fetch request
    const response = await fetch(`http://127.0.0.1:8000/${address}`, {
        method: method,
        credentials: authenticate ? 'include' : "omit",
        headers: headers,
        body: JSON.stringify(obj),
    });
    // Clone the response to use the body more than once
    const clonedResponse = response.clone();
    const responseData = await clonedResponse.json();
    // @ts-ignore
    const serverResponse: ServerResponse<ReturnType<typeof apiInterface[T][S]["args"]>> = {
        ok: clonedResponse.ok,
        data: clonedResponse.ok ? responseData : undefined,
        error: clonedResponse.ok ? undefined : responseData,
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
    }
    return serverResponse;
}