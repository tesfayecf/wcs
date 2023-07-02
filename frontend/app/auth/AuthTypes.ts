
export interface ILoginForm {
    email: string;
    password: string;
}

export interface IRegisterForm {
    name: string;
    last_name: string;
    email: string;
    password: string;
    re_password: string;
}

export interface IResetPassword {
    old_password: string;
    password: string;
    re_password: string;
}

export interface AuthStore {
    loginForm: ILoginForm,
    registerForm: IRegisterForm,
    resetPasswordForm: IResetPassword,
}