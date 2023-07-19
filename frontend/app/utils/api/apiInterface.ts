import { IRegisterForm } from "@/app/(auth)/AuthTypes";
import { ITankGroup } from "@/app/(pages)/dashboard/DashboardTypes";
import { ITank } from "@/app/(pages)/tanks/TanksTypes";

export interface APIResponse<T> {
    data?: T;
    error?: any;
    request?: any;
    status?: number;
    statusText?: string;
    headers?: any;
    config?: any;
    isSuccess?: boolean;
    isFailure?: boolean;
}



export const APIInterface = {
    app: {

    },
    auth: {
        register: {
            args: (args: Partial<IRegisterForm>): APIResponse<string> => { return {} as APIResponse<string> },
            endpoint: "users/",
            method: "POST",
            argsKeys: ["first_name", "last_name", "email", "password", "re_password"],
        },
        login: {
            args: (email: string, password: string): APIResponse<{ access: string, refresh: string }> => { return {} as APIResponse<{ access: string, refresh: string }> },
            endpoint: "api/jwt/create/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            endpoint: "api/logout/",
            method: "POST",
            argsKeys: []
        },
        verify: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            endpoint: "api/jwt/verify/",
            method: "POST",
            argsKeys: [],
        }
    },
    dashboard: {
        createTankGroup: {
            args: (name: string, location: string): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            endpoint: "create-tank-group/",
            method: "POST",
            argsKeys: ["name", "location"],
        },
        getTankGroups: {
            args: (): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            endpoint: "tank-groups/",
            method: "GET",
            argsKeys: [""],
        }
    }
} as const;

/**
 * register: builder.mutation({
//             query: ({
//                 first_name,
//                 last_name,
//                 email,
//                 password,
//                 re_password,
//             }) => ({
//                 url: '/users/',
//                 method: 'POST',
//                 body: { first_name, last_name, email, password, re_password },
//             }),
//         }),
 */