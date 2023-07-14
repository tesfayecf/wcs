
export interface ILoginForm {
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
}
export interface IRegisterForm {
    first_name: string;
    first_nameError: boolean;
    last_name: string;
    last_nameError: boolean;
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
    re_password: string;
    re_passwordError: boolean;
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