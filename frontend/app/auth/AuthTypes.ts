
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

export interface IResetPassword {
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
    resetPasswordForm: IResetPassword,
}

///////////////
//// ENDPOINTS
///////////////

interface User {
    first_name: string;
    last_name: string;
    email: string;
}
export interface IAuthEndpoints {
    retrieveUser: () => Promise<User | undefined>;
    login: (email: string, password: string) => Promise<void>;
    register: (data: User & { password: string; re_password: string }) => Promise<void>;
    verify: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}