'use server'
import { cookies } from 'next/headers'
import { serverRequest } from '../api/request';

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 24 * 7, // 1 week
};

const storeToken = async (name: 'access' | 'refresh', value: string) => {
    await cookies().set({
        name,
        value,
        ...COOKIE_OPTIONS,
    });
};

export const storeAccessToken = (access: string) => storeToken('access', access);
export const storeRefreshToken = (refresh: string) => storeToken('refresh', refresh);

const getTokens = () => {
    const accessToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;
    return { accessToken, refreshToken };
};

export const authenticate = async (): Promise<boolean> => {
    const { accessToken, refreshToken } = getTokens();

    if (!accessToken || !refreshToken) {
        console.log("User not authenticated -> auth");
        return false;
    }

    try {
        const accessResponse = await serverRequest("auth", "verify", [accessToken]);
        if (accessResponse.ok) {
            console.log("User authenticated - access auth");
            return true;
        }

        return await refreshAccessToken();
    } catch (error) {
        console.error("Authentication error:", error);
        return false;
    }
};

export const verify = async (): Promise<boolean> => {
    const { accessToken, refreshToken } = getTokens();

    if (!accessToken || !refreshToken) {
        console.log("User not verified");
        return false;
    }

    try {
        const accessResponse = await serverRequest("auth", "verify", [accessToken]);
        if (accessResponse.ok) {
            console.log("User access verified");
            return true;
        }

        return await refreshAccessToken();
    } catch (error) {
        console.error("Verification error:", error);
        return false;
    }
};

const refreshAccessToken = async (): Promise<boolean> => {
    try {
        const refreshResponse = await serverRequest("auth", "refresh", []);
        if (refreshResponse.ok && refreshResponse.data?.access) {
            console.log("Updated access token");
            await storeAccessToken(refreshResponse.data.access);
            return true;
        }
        console.log("Failed to refresh access token");
        return false;
    } catch (error) {
        console.error("Refresh error:", error);
        return false;
    }
};

export const refresh = async (): Promise<boolean> => {
    return await refreshAccessToken();
};