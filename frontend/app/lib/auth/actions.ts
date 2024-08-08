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
    console.log(`[storeToken] Stored ${name} token`);
};

export const storeAccessToken = (access: string) => {
    console.log('[storeAccessToken] Storing access token');
    return storeToken('access', access);
};

export const storeRefreshToken = (refresh: string) => {
    console.log('[storeRefreshToken] Storing refresh token');
    return storeToken('refresh', refresh);
};

export const getTokens = () => {
    const accessToken = cookies().get("access")?.value;
    const refreshToken = cookies().get("refresh")?.value;
    console.log('[getTokens] Retrieved tokens');
    return { accessToken, refreshToken };
};

export const authenticate = async (): Promise<boolean> => {
    console.log('[authenticate] Starting authentication process');
    const { accessToken, refreshToken } = getTokens();

    if (!accessToken || !refreshToken) {
        console.log("[authenticate] User not authenticated -> auth");
        return false;
    }

    try {
        const accessResponse = await serverRequest("auth", "verify", [accessToken]);
        if (accessResponse.ok) {
            console.log("[authenticate] User authenticated - access auth");
            return true;
        }

        console.log("[authenticate] Access token invalid, refresh needed");
        // return await refresh();
        return false;
    } catch (error) {
        console.error("[authenticate] Authentication error:", error);
        return false;
    }
};

export const verify = async (): Promise<boolean> => {
    console.log('[verify] Starting verification process');
    const { accessToken, refreshToken } = getTokens();

    if (!accessToken || !refreshToken) {
        console.log("[verify] User not verified - missing tokens");
        return false;
    }

    try {
        const accessResponse = await serverRequest("auth", "verify", [accessToken]);
        if (accessResponse.ok) {
            console.log("[verify] User access verified");
            return true;
        }

        console.log("[verify] Access token invalid, refresh needed");
        // return await refresh();
        return false;
    } catch (error) {
        console.error("[verify] Verification error:", error);
        return false;
    }
};

export const refresh = async (): Promise<boolean> => {
    console.log('[refresh] Starting token refresh process');
    try {
        const refreshResponse = await serverRequest("auth", "refresh", []);
        if (refreshResponse.ok && refreshResponse.data?.access) {
            console.log("[refresh] Updated access token");
            await storeAccessToken(refreshResponse.data.access);
            return true;
        }
        console.log("[refresh] Failed to refresh access token");
        return false;
    } catch (error) {
        console.error("[refresh] Refresh error:", error);
        return false;
    }
};