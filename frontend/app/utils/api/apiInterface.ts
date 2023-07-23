import { IRegisterForm } from "@/app/(auth)/AuthTypes";
import { ITankGroup } from "@/app/(pages)/dashboard/DashboardTypes";
import { ITank } from "@/app/(pages)/tanks/TanksTypes";
import { IUserInfo } from "@/app/app/AppTypes";

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
        getUserInfo: {
            args: (): APIResponse<Partial<IUserInfo>> => { return {} as APIResponse<Partial<IUserInfo>> },
            address: "auth/user/",
            method: "GET",
            argsKeys: [],
        }
    },
    auth: {
        register: {
            args: (args: Partial<IRegisterForm>): APIResponse<string> => { return {} as APIResponse<string> },
            address: "auth/users/",
            method: "POST",
            argsKeys: ["first_name", "last_name", "email", "password", "re_password"],
        },
        login: {
            args: (email: string, password: string): APIResponse<{ access: string, refresh: string }> => { return {} as APIResponse<{ access: string, refresh: string }> },
            address: "auth/create/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/logout/",
            method: "POST",
            argsKeys: []
        },
        verify: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/verify/",
            method: "POST",
            argsKeys: [],
        },
        refresh: {
            args: (obj: any): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/refresh/",
            method: "POST",
            argsKeys: []
        },
    },
    dashboard: {
        createTankGroup: {
            args: (name: string, location: string, description: string): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            address: "api/create-tank-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        getTankGroups: {
            args: (): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            address: "api/tank-groups/",
            method: "GET",
            argsKeys: [],
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