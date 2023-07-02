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


export const AuthEndpoints: IAuthEndpoints = {
    retrieveUser: async () => {
        try {
            const response = await fetch('/users/me/');
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Failed to retrieve user:', error);
            return undefined;
        }
    },
    login: async (email, password) => {
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
    register: async (data) => {
        try {
            const response = await fetch('/users/', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            // Process the registration response as needed
        } catch (error) {
            console.error('Failed to register:', error);
        }
    },
    verify: async () => {
        try {
            const response = await fetch('/jwt/verify/', {
                method: 'POST',
            });
            // Process the verification response as needed
        } catch (error) {
            console.error('Failed to verify token:', error);
        }
    },
    logout: async () => {
        try {
            const response = await fetch('/logout/', {
                method: 'POST',
            });
            // Process the logout response as needed
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    },
    resetPassword: async (email) => {
        try {
            const response = await fetch('/users/reset_password/', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            // Process the reset password response as needed
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    },
};
