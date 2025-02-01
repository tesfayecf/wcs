
// AUTH STORE

export interface IAuthStore { }

// LOGIN

export interface ILoginForm {
    email: string,
    password: string
}

// SIGNUP

export interface ISignupForm {
    username: string,
    email: string,
    password: string,
    confirm: string
}

// RECOVER


// RESET

export interface IResetForm {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}
