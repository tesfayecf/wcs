'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { serverRequest } from '../api/request';

export const storeAccesToken = async (access: string) => {
    await cookies().set({
        name: "access",
        value: access,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export const storeRefreshToken = async (refresh: string) => {
    await cookies().set({
        name: "refresh",
        value: refresh,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export const authenticate = async () => {
    const accesToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;

    // Check if it has cookies
    if (!accesToken || !refreshToken) {
        console.log("User not authenticated -> auth");
        // redirect("/login");
        return false;
    }

    try {
        const accessReponse = await serverRequest("auth", "verify", [accesToken])
        if (accessReponse.ok) {
            console.log("User authenticated - access auth");
            return true
        }

        const refreshResponse = await serverRequest("auth", "refresh", [])
        if (refreshResponse.ok) {
            console.log("User authenticated - refresh auth");
            await cookies().set({
                name: "access",
                value: refreshResponse.data.access,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            return true
        }

        // Access and refresh tokens are not valid, redirect to login
        console.log("Access and refresh tokens are not valid verify");
        // redirect("./login");
        return false;

    } catch (error) {
        console.error("Error:", error);
        // redirect("./login");
        return false;
    }
}

export const verify = async () => {
    const accesToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;

    // Check if it has cookies
    if (!accesToken || !refreshToken) {
        console.log("User not authenticated verify");
        return false
    }

    try {
        const accessReponse = await serverRequest("auth", "verify", [accesToken])
        if (accessReponse.ok) {
            console.log("User authenticated - access verify");
            return true;
        }

        const refreshResponse = await serverRequest("auth", "refresh", [])
        if (refreshResponse.ok) {
            console.log("Updated access token:", refreshResponse.data.access);
            await cookies().set({
                name: "access",
                value: refreshResponse.data.access,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            return true
        }

        // Access and refresh tokens are not valid, redirect to login
        console.log("Access and refresh tokens are not valid - verify");
        return false;

    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

export const refresh = async () => {
    return false;
}