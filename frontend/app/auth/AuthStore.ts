import { produce } from "immer";
import { IStore } from "../store/storeTypes";
import { IAuthEndpoints, IAuthStore, ILoginForm, IRegisterForm, IResetPasswordForm } from "./AuthTypes";
import RequestHandler from "../utils/request/requestHandler";

const requestHandler = RequestHandler.getInstance();

export const AuthStoreDefault: IAuthStore = {
    loginForm: {
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
    },
    registerForm: {
        first_name: 'fefasdfadscasdcasdfds',
        first_nameError: false,
        last_name: 'ferfefewfadsfasdf',
        last_nameError: false,
        email: 'adfcfqewfasdx@gmail.com',
        emailError: false,
        password: 'qwertyuiop',
        passwordError: false,
        re_password: 'qwertyuiop',
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
        // Login Form
        setLoginFormEmail: (email: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.email = email;
                return state;
            }), false, "setLoginFormEmail");
        },
        setLoginFormEmailError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.emailError = error;
                return state;
            }), false, "setLoginFormEmail");
        },
        setLoginFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.password = password;
                return state;
            }), false, "setLoginFormPassword");
        },
        setLoginFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.passwordError = error;
                return state;
            }), false, "setLoginFormPasswordError");
        },
        // Register Form
        setRegisterForm: (registerForm: IRegisterForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm = registerForm;
                return state;
            }), false, "setRegisterForm");
        },

        setRegisterFormFirstName:   (first_name: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.first_name = first_name;
                return state;
            }), false, "setRegisterFormFirstName");
        },
        setRegisterFormFirstNameError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.first_nameError = error;
                return state;
            }), false, "setRegisterFormFirstNameError");
        },
        setRegisterFormLastName: (last_name: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.last_name = last_name;
                return state;
            }), false, "setRegisterFormLastName");
        },
        setRegisterFormLastNameError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.last_nameError = error;
                return state;
            }), false, "setRegisterFormLastNameError");
        },
        setRegisterFormEmail: (email: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.email = email;
                return state;
            }), false, "setRegisterFormEmail");
        },
        setRegisterFormEmailError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.emailError = error;
                return state;
            }), false, "setRegisterFormEmailError");
        },
        setRegisterFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.password = password;
                return state;
            }), false, "setRegisterFormPassword");
        },
        setRegisterFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.passwordError = error;
                return state;
            }), false, "setRegisterFormPasswordError");
        },
        setRegisterFormRePassword: (re_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.re_password = re_password;
                return state;
            }), false, "setRegisterFormRePassword");
        },
        setRegisterFormRePasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.re_passwordError = error;
                return state;
            }), false, "setRegisterFormRePasswordError");
        },
        // Reset Password Form
        setResetPasswordFormOldPassword: (old_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.old_password = old_password;
                return state;
            }), false, "setResetPasswordFormOldPassword");
        },
        setResetPasswordFormOldPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.old_passwordError = error;
                return state;
            }), false, "setResetPasswordFormOldPasswordError");
        },
        setResetPasswordFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.password = password;
                return state;
            }), false, "setResetPasswordFormPassword");
        },
        setResetPasswordFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.passwordError = error;
                return state;
            }), false, "setResetPasswordFormPasswordError");
        },
        setResetPasswordFormRePassword: (re_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.re_password = re_password;
                return state;
            }), false, "setResetPasswordFormRePassword");
        },
        setResetPasswordFormRePasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.re_passwordError = error;
                return state;
            }), false, "setResetPasswordFormRePasswordError");
        },

        // Utils
        getUser: async (set: any = setLocal, get: any = getLocal) => {
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
        register: async (first_name: string, last_name: string, email: string, password: string, re_password: string, set: any = setLocal, get: any = getLocal) => {

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

