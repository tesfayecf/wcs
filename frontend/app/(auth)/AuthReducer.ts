import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAuthStore, ILoginForm, IRegisterForm, IResetPasswordForm } from './AuthTypes';


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
        first_nameError: false,
        last_name: '',
        last_nameError: false,
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
        re_password: '',
        re_passwordError: false,
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
        setLoginFormEmail: (state, action: PayloadAction<string>) => {
            state.loginForm.email = action.payload;
        },
        setLoginFormEmailError: (state, action: PayloadAction<boolean>) => {
            state.loginForm.emailError = action.payload;
        },
        setLoginFormPassword: (state, action: PayloadAction<string>) => {
            state.loginForm.password = action.payload;
        },
        setLoginFormPasswordError: (state, action: PayloadAction<boolean>) => {
            state.loginForm.passwordError = action.payload;
        },
        setRegisterForm: (state, action: PayloadAction<IRegisterForm>) => {
            state.registerForm = action.payload;
        },
        setRegisterFormFirstName: (state, action: PayloadAction<string>) => {
            state.registerForm.first_name = action.payload;
        },
        setRegisterFormFirstNameError: (state, action: PayloadAction<boolean>) => {
            state.registerForm.first_nameError = action.payload;
        },
        setRegisterFormLastName: (state, action: PayloadAction<string>) => {
            state.registerForm.last_name = action.payload;
        },
        setRegisterFormLastNameError: (state, action: PayloadAction<boolean>) => {
            state.registerForm.last_nameError = action.payload;
        },
        setRegisterFormEmail: (state, action: PayloadAction<string>) => {
            state.registerForm.email = action.payload;
        },
        setRegisterFormEmailError: (state, action: PayloadAction<boolean>) => {
            state.registerForm.emailError = action.payload;
        },
        setRegisterFormPassword: (state, action: PayloadAction<string>) => {
            state.registerForm.password = action.payload;
        },
        setRegisterFormPasswordError: (state, action: PayloadAction<boolean>) => {
            state.registerForm.passwordError = action.payload;
        },
        setRegisterFormRePassword: (state, action: PayloadAction<string>) => {
            state.registerForm.re_password = action.payload;
        },
        setRegisterFormRePasswordError: (state, action: PayloadAction<boolean>) => {
            state.registerForm.re_passwordError = action.payload;
        },
        setResetPasswordForm: (state, action: PayloadAction<IResetPasswordForm>) => {
            state.resetPasswordForm = action.payload;
        },
        setResetPasswordFormOldPassword: (state, action: PayloadAction<string>) => {
            state.resetPasswordForm.old_password = action.payload;
        },
        setResetPasswordFormOldPasswordError: (state, action: PayloadAction<boolean>) => {
            state.resetPasswordForm.old_passwordError = action.payload;
        },
        setResetPasswordFormPassword: (state, action: PayloadAction<string>) => {
            state.resetPasswordForm.password = action.payload;
        },
        setResetPasswordFormPasswordError: (state, action: PayloadAction<boolean>) => {
            state.resetPasswordForm.passwordError = action.payload;
        },
        setResetPasswordFormRePassword: (state, action: PayloadAction<string>) => {
            state.resetPasswordForm.re_password = action.payload;
        },
        setResetPasswordFormRePasswordError: (state, action: PayloadAction<boolean>) => {
            state.resetPasswordForm.re_passwordError = action.payload;
        },
    },
});

// Export the actions
export const authActions = authSlice.actions;

// Export the reducer
export default authSlice.reducer;