




import { apiEnpoint, authApiReducer, type authApiReducerEndpoints } from "@/app/(auth)/AuthApiReducer"




export interface IApiInterface extends authApiReducerEndpoints { }

export type TApiBlock = "APP" | "AUTH" | "DASHBOARD";
type TApiInterfaceEndpoints = Record<keyof IApiInterface, any>
type TApiInterface = Record<TApiBlock, Partial<TApiInterfaceEndpoints>>

export const API_INTERFACE: TApiInterface = {
    AUTH: {
        retrieveUser: authApiReducer.useRetrieveUserQuery,
        login: authApiReducer.useLoginMutation,
        register: authApiReducer.useRegisterMutation,
        verify: authApiReducer.useVerifyMutation,
        logout: authApiReducer.useLogoutMutation,
        activation: authApiReducer.useActivationMutation,
        resetPassword: authApiReducer.useResetPasswordMutation,
        resetPasswordConfirm: authApiReducer.useResetPasswordConfirmMutation,
    },
    APP: {},
    DASHBOARD: {}

} as const;