import { apiReducer } from "../utils/api/apiReducer";

interface User {
    first_name: string;
    last_name: string;
    email: string;
}

export const authApiReducer = apiReducer.injectEndpoints({
    endpoints: builder => ({
        retrieveUser: builder.query<User, void>({
            query: () => '/users/me/',
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: '/jwt/create/',
                method: 'POST',
                body: { email, password },
            }),
        }),
        register: builder.mutation({
            query: ({
                first_name,
                last_name,
                email,
                password,
                re_password,
            }) => ({
                url: '/users/',
                method: 'POST',
                body: { first_name, last_name, email, password, re_password },
            }),
        }),
        verify: builder.mutation({
            query: () => ({
                url: '/jwt/verify/',
                method: 'POST',
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout/',
                method: 'POST',
            }),
        }),
        activation: builder.mutation({
            query: ({ uid, token }) => ({
                url: '/users/activation/',
                method: 'POST',
                body: { uid, token },
            }),
        }),
        resetPassword: builder.mutation({
            query: email => ({
                url: '/users/reset_password/',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPasswordConfirm: builder.mutation({
            query: ({ uid, token, new_password, re_new_password }) => ({
                url: '/users/reset_password_confirm/',
                method: 'POST',
                body: { uid, token, new_password, re_new_password },
            }),
        }),
    }),
});

export type authApiReducerEndpoints = typeof authApiReducer.endpoints;
export type apiEnpoint = typeof authApiReducer.endpoints.verify;

export const {
    useRetrieveUserQuery,
    useLoginMutation,
    useRegisterMutation,
    useVerifyMutation,
    useLogoutMutation,
    useActivationMutation,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
} = authApiReducer;

// export { useRetrieveUserQuery as RetrieveUser };
// export { useLoginMutation as Login };
// export { useRegisterMutation as Register };
// export { useVerifyMutation as Verify };
// export { useLogoutMutation as Logout };
// export { useActivationMutation as Activatio };
// export { useResetPasswordMutation as ResetPassword };
// export { useResetPasswordConfirmMutation as ResetPasswordConfirm };