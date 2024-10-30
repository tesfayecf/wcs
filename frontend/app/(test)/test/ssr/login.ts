"use server";
import { cookies } from 'next/headers'
import { RedirectType, redirect } from "next/navigation";

interface StoreTokenRequest {
    access: string
    refresh: string
}

export async function storeToken(request: StoreTokenRequest) {
    cookies().set({
        name: "access",
        value: request.access,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })

    cookies().set({
        name: "refresh",
        value: request.refresh,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export const login = async () => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "tesfayecarreras02@gmail.com",
                password: "1234"
            }),
        };

        const response = await fetch(`http://127.0.0.1:8000/api/auth/login/`, options);
        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);
            // Store tokens
            storeToken({
                access: data.access,
                refresh: data.refresh,
            });

            return true
        } else {
            console.error("Login failed");
            return false
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return false
        // Handle unexpected errors (e.g., display error message to user)
    }
};
