
export interface ILoginForm {
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
}

export interface ILoginFormN {
    "Email": string,
    "Password": string
}

export interface IRegisterForm {
    first_name: string;
    firstNameError: boolean;
    last_name: string;
    lastNameError: boolean;
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
    rePassword: string;
    rePasswordError: boolean;
}

export interface IResetPasswordForm {
    old_password: string;
    old_passwordError: boolean;
    password: string;
    passwordError: boolean;
    re_password: string;
    re_passwordError: boolean;
}

export interface IAuthStore {
    loginForm: ILoginForm,
    registerForm: IRegisterForm,
    resetPasswordForm: IResetPasswordForm,
}