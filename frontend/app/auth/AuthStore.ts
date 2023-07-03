import { IAuthEndpoints, IAuthStore } from "./AuthTypes";

export const AuthStoreDefault: IAuthStore = {
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
    }
}


export function getAuthEndpoints(setLocal: any, getLocal: any): IAuthEndpoints {
    return {
        retrieveUser: async (set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/users/me/');
                const user = await response.json();
                return user;
            } catch (error) {
                console.error('Failed to retrieve user:', error);
                return undefined;
            }
        },
        login: async (email: string, password: string, set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/jwt/create/', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                // Process the login response as needed
            } catch (error) {
                console.error('Failed to login:', error);
            }
        },
        register: async (first_name: string, last_name: string, email: string, password: string, set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/users/', {
                    method: 'POST',
                    body: JSON.stringify({ first_name, last_name, email, password }),
                });
                // Process the registration response as needed
            } catch (error) {
                console.error('Failed to register:', error);
            }
        },
        verify: async (set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/jwt/verify/', {
                    method: 'POST',
                });
                // Process the verification response as needed
            } catch (error) {
                console.error('Failed to verify token:', error);
            }
        },
        logout: async (set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/logout/', {
                    method: 'POST',
                });
                // Process the logout response as needed
            } catch (error) {
                console.error('Failed to logout:', error);
            }
        },
        resetPassword: async (email: string, set: any = setLocal, get: any = getLocal) => {
            try {
                const response = await fetch('/users/reset_password/', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                });
                // Process the reset password response as needed
            } catch (error) {
                console.error('Failed to reset password:', error);
            }
        }
    }
}

