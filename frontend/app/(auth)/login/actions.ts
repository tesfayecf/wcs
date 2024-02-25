"use server";
import { cookies } from 'next/headers'
import { ILoginForm } from '../AuthTypes';
import { serverRequest } from '@/app/lib/api/server';

interface StoreTokenRequest {
    access: string
    refresh: string
}

export async function storeTokens(request: StoreTokenRequest) {
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

export const loginAction = async (loginForm: ILoginForm) => {
    try {
        const response = await serverRequest("auth", "login", [loginForm.email, loginForm.password], false);
        if (response) {
            console.log("Login successful");
            storeTokens({ access: response.data.access, refresh: response.data.refresh, });
            return true
        } else {
            console.error("Login failed");
            return false
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return false
    }
};
