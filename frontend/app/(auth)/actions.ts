"use server";
import { redirect } from 'next/navigation';
import { serverRequest } from '@/app/lib/api/request';
import { ILoginForm } from '@/app/(auth)/types';

export const authenticate = async () => {
    try {
        // Make request
        const response = await serverRequest("auth", "verify", {});
        return response.status === 200;
    } catch (error) {
        // Log error
    }
};

export const login = async (loginForm: ILoginForm) => {
    try {
        // Make request
        const response = await serverRequest("auth", "login", {
            email: loginForm.email,
            password: loginForm.password
        })

        if (response.status === 200) redirect("/");
        else return false;
    } catch (error) {
        // Log error
    }
};

export const logout = async () => {
    try {
        // Make request
        const response = await serverRequest("auth", "logout", {});
        return response.status === 200;
    } catch (error) {
        // Log error
    }
};