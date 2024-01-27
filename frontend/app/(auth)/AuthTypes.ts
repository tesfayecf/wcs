
export interface ILoginForm {
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
}

export interface ILoginFormN {
    "email": string,
    "password": string
}

export interface IRegisterForm {
    firstName: string;
    firstNameError: boolean;
    lastName: string;
    lastNameError: boolean;
    email: string;
    emailError: boolean;
    password: string;
    passwordError: boolean;
    rePassword: string;
    rePasswordError: boolean;
}

export interface IRegisterFormN {
    "firstName": string,
    "lastName": string,
    "email": string,
    "password": string,
    "confirmPassword": string
}

export interface IResetPasswordForm {
    oldPassword: string;
    oldPasswordError: boolean;
    password: string;
    passwordError: boolean;
    rePassword: string;
    rePasswordError: boolean;
}

export interface IResetPasswordFormN {
    "Old Password": string,
    "New Password": string,
    "Confirm Password": string
}

export interface IAuthStore {
    loginForm: ILoginForm,
    registerForm: IRegisterForm,
    resetPasswordForm: IResetPasswordForm,
}