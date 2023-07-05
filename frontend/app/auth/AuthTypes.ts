
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

///////////////
//// ENDPOINTS
///////////////

interface User {
    first_name: string;
    last_name: string;
    email: string;
}
export interface IAuthEndpoints {
    // Login Form
    setLoginFormEmail: (email: string, set?: any, get?: any) => void;
    setLoginFormEmailError: (error: boolean, set?: any, get?: any) => void;
    setLoginFormPassword: (password: string, set?: any, get?: any) => void;
    setLoginFormPasswordError: (error: boolean, set?: any, get?: any) => void;
    // Register Form
    setRegisterFormFirstName: (first_name: string, set?: any, get?: any) => void;
    setRegisterFormFirstNameError: (error: boolean, set?: any, get?: any) => void;
    setRegisterFormLastName: (last_name: string, set?: any, get?: any) => void;
    setRegisterFormLastNameError: (error: boolean, set?: any, get?: any) => void;
    setRegisterFormEmail: (email: string, set?: any, get?: any) => void;
    setRegisterFormEmailError: (error: boolean, set?: any, get?: any) => void;
    setRegisterFormPassword: (password: string, set?: any, get?: any) => void;
    setRegisterFormPasswordError: (error: boolean, set?: any, get?: any) => void;
    setRegisterFormRePassword: (re_password: string, set?: any, get?: any) => void;
    setRegisterFormRePasswordError: (error: boolean, set?: any, get?: any) => void;
    setResetPasswordFormOldPassword: (old_password: string, set?: any, get?: any) => void;
    // Reset Password Form
    setResetPasswordFormOldPasswordError: (error: boolean, set?: any, get?: any) => void;
    setResetPasswordFormPassword: (password: string, set?: any, get?: any) => void;
    setResetPasswordFormPasswordError: (error: boolean, set?: any, get?: any) => void;
    setResetPasswordFormRePassword: (re_password: string, set?: any, get?: any) => void;
    setResetPasswordFormRePasswordError: (error: boolean, set?: any, get?: any) => void;

    getUser: (set?: any, get?: any) => Promise<User | undefined>;
    login: (email: string, password: string, set?: any, get?: any) => Promise<void>;
    register: (first_name: string, last_name: string, email: string, password: string, re_password: string, set?: any, get?: any) => Promise<void>;
    verify: (set?: any, get?: any) => Promise<void>;
    logout: (set?: any, get?: any) => Promise<void>;
    resetPassword: (email: string, set?: any, get?: any) => Promise<void>;
}