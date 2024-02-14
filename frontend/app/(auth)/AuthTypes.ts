
export interface ILoginForm {
    email: string,
    password: string
}

export interface ISignupForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface IResetForm {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface IAuthStore { }