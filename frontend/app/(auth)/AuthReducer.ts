import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAuthStore, ILoginForm } from '@/app/(auth)/AuthTypes';


// Define the initial state
const initialState: IAuthStore = {
    loginForm: {
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
    },
    registerForm: {
        first_name: '',
        firstNameError: false,
        last_name: '',
        lastNameError: false,
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
        rePassword: '',
        rePasswordError: false,
    },
    resetPasswordForm: {
        old_password: '',
        old_passwordError: false,
        password: '',
        passwordError: false,
        re_password: '',
        re_passwordError: false,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginForm: (state, action: PayloadAction<ILoginForm>) => {
            state.loginForm = action.payload;
        },
        setLoginFormEmail: (state, action: PayloadAction<{ email: string, error: boolean }>) => {
            state.loginForm.email = action.payload.email;
            state.loginForm.emailError = action.payload.error;
        },

        setLoginFormPassword: (state, action: PayloadAction<{ password: string, error: boolean }>) => {
            state.loginForm.password = action.payload.password;
            state.loginForm.passwordError = action.payload.error;
        },

        setRegisterFormFirstName: (state, action: PayloadAction<{ firstName: string, error: boolean }>) => {
            state.registerForm.first_name = action.payload.firstName;
            state.registerForm.firstNameError = action.payload.error;
        },

        setRegisterFormLastName: (state, action: PayloadAction<{ lastName: string, error: boolean }>) => {
            state.registerForm.last_name = action.payload.lastName;
            state.registerForm.lastNameError = action.payload.error;
        },

        setRegisterFormEmail: (state, action: PayloadAction<{ email: string, error: boolean }>) => {
            state.registerForm.email = action.payload.email;
            state.registerForm.emailError = action.payload.error;
        },

        setRegisterFormPassword: (state, action: PayloadAction<{ password: string, error: boolean }>) => {
            state.registerForm.password = action.payload.password;
            state.registerForm.passwordError = action.payload.error;
        },

        setRegisterFormRePassword: (state, action: PayloadAction<{ rePassword: string, error: boolean }>) => {
            state.registerForm.rePassword = action.payload.rePassword;
            state.registerForm.rePasswordError = action.payload.error;
        },

        setResetPasswordFormOldPassword: (state, action: PayloadAction<{ oldPassword: string, error: boolean }>) => {
            state.resetPasswordForm.old_password = action.payload.oldPassword;
            state.resetPasswordForm.old_passwordError = action.payload.error;
        },

        setResetPasswordFormPassword: (state, action: PayloadAction<{ password: string, error: boolean }>) => {
            state.resetPasswordForm.password = action.payload.password;
            state.resetPasswordForm.passwordError = action.payload.error;
        },

        setResetPasswordFormRePassword: (state, action: PayloadAction<{ rePassword: string, error: boolean }>) => {
            state.resetPasswordForm.re_password = action.payload.rePassword;
            state.resetPasswordForm.re_passwordError = action.payload.error;
        },

    },
});

// Export the actions
export const authActions = authSlice.actions;

// Export the reducer
export default authSlice.reducer;