"use server";
import { cookies } from 'next/headers'
import { ILoginForm } from './types';
import { serverRequest } from '@/app/lib/api/request';

interface StoreTokenRequest {
    access: string
    refresh: string
}

export async function storeTokens(request: StoreTokenRequest) {
    await cookies().set({
        name: "access",
        value: request.access,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })

    await cookies().set({
        name: "refresh",
        value: request.refresh,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    })
}

export const login = async (loginForm: ILoginForm) => {
    try {
        const response = await serverRequest("auth", "login", [loginForm.email, loginForm.password], false);
        if (response) {
            // storeTokens({ access: response.data.access, refresh: response.data.refresh, });
            if (response.data.access && response.data.refresh) {
                await cookies().set({
                    name: "access",
                    value: response.data.access,
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                })
                await cookies().set({
                    name: "refresh",
                    value: response.data.refresh,
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                })
                console.log("Login successful");
                return true
            } else {
                console.error("Tokens not found");
                return false
            }
        } else {
            console.error("Login failed");
            return false
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return false
    }
};
