"use server";
import { ILoginForm } from '@/app/(auth)/types';
import { serverRequest } from '@/app/lib/api/request';
import { redirect } from 'next/navigation';

export const authenticate = async (): Promise<boolean> => {
    try {
        const verifyResponse = await serverRequest("auth", "verify", []);
        return verifyResponse.status === 200;
    } catch (error) {
        return false;
    }
};

export const login = async (loginForm: ILoginForm) => {
    try {
        const response = await serverRequest("auth", "login", {
            email: loginForm.email,
            password: loginForm.password
        })

        if (response.status === 200) redirect("/");
        else return response.data;
    } catch (error) {
        return false
    }
};

export const logout = async () => {
    try {
        const response = await serverRequest("auth", "logout", {});
        if (response) return true;
        else return false;
    } catch (error) {
        return false
    }
};