'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export async function storeAccesToken(access: string) {
    cookies().set({
        name: "access",
        value: access,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export async function storeRefreshToken(refresh: string) {
    cookies().set({
        name: "refresh",
        value: refresh,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export const authenticate = async () => {
    const accessToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;

    // Check if it has cookies
    if (!accessToken || !refreshToken) {
        console.log("User not authenticated auth");
        redirect("/login");
    }

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Check access token is valid
    try {
        const accessHeaders = new Headers();
        accessHeaders.append("Cookie", `access=${accessToken};`);

        const accessResponse = await fetch('http://127.0.0.1:8000/api/auth/verify/', {
            method: "POST",
            credentials: 'include',
            headers: accessHeaders,
        });

        if (accessResponse.ok) {
            // Access token is valid
            console.log("User authenticated - access auth");
            return
        }

        const refreshHeaders = new Headers();
        refreshHeaders.append("Cookie", `refresh=${refreshToken};`);

        // Check if refresh token is valid
        const refreshResponse = await fetch('http://127.0.0.1:8000/api/auth/refresh/', {
            method: "POST",
            credentials: 'include',
            headers: refreshHeaders,
        });

        if (refreshResponse.ok) {
            // Access token is valid
            console.log("User authenticated - refresh auth");
            return
        }

        // Access and refresh tokens are not valid, redirect to login
        console.log("Access and refresh tokens are not valid verify");
        redirect("./login");

    } catch (error) {
        console.error("Error:", error);
        redirect("./login");
    }
}

export const verify = async () => {
    const accessToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;

    // Check if it has cookies
    if (!accessToken || !refreshToken) {
        console.log("User not authenticated verify");
        return false
    }

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Check access token is valid
    try {
        const accessHeaders = new Headers();
        accessHeaders.append("Cookie", `access=${accessToken};`);

        const accessResponse = await fetch('http://127.0.0.1:8000/api/auth/verify/', {
            method: "POST",
            credentials: 'include',
            headers: accessHeaders,
        });

        if (accessResponse.ok) {
            // Access token is valid
            console.log("User authenticated - access verify");
            return true;
            redirect("/dashboard");
        }

        const refreshHeaders = new Headers();
        refreshHeaders.append("Cookie", `refresh=${refreshToken};`);

        // Check if refresh token is valid
        const refreshResponse = await fetch('http://127.0.0.1:8000/api/auth/refresh/', {
            method: "POST",
            credentials: 'include',
            headers: refreshHeaders,
        });

        if (refreshResponse.ok) {
            // Access token is valid
            console.log("User authenticated - refresh verfiy");

            // Update access token
            const data = await refreshResponse.json()
            const updatedAccessToken = data.access;
            storeAccesToken(updatedAccessToken);
            return true;
            redirect("/dashboard");
        }

        // Access and refresh tokens are not valid, redirect to login
        console.log("Access and refresh tokens are not valid verify");
        return false;

    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}