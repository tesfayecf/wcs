'use server'
import { serverRequest } from "../lib/api/request";

export const getUserInfo = async () => {
    try {
        // Make request
        const response = await serverRequest("user", "getUserInfo", null);
        return response;
    } catch (error) {
        // Log error
    }
}

export const getUserPermissions = async () => {
    try {
        // Make request
        // const response = await serverRequest("user", "getUserPermissions", {});
        // return response;
    } catch (error) {
        // Log error
    }
}