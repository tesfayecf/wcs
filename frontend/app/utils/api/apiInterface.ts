import { IRegisterForm } from "@/app/(auth)/AuthTypes";

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
            args: (email: string, password: string): APIResponse<string> => { return {} as APIResponse<string> },
            endpoint: "api/jwt/create/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            endpoint: "api/jwt/delete/",
            method: "POST",
            argsKeys: []
        },
        verify: {
            args: (token: string): APIResponse<void> => { return {} as APIResponse<void> },
            endpoint: "api/jwt/verify/",
            method: "POST",
            argsKeys: ["token"],
        }
    },
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