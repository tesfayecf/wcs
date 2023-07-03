
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
    retrieveUser: (set?: any, get?: any) => Promise<User | undefined>;
    login: (email: string, password: string, set?: any, get?: any) => Promise<void>;
    register: (first_name: string, last_name: string, email: string, password: string, set?: any, get?: any) => Promise<void>;
    verify: (set?: any, get?: any) => Promise<void>;
    logout: (set?: any, get?: any) => Promise<void>;
    resetPassword: (email: string, set?: any, get?: any) => Promise<void>;
}