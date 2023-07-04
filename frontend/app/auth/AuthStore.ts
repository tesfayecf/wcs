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
        setLoginForm: (loginForm: ILoginForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm = loginForm;
                return state;
            }), false, "setLoginForm");
        },
        setRegisterForm: (registerForm: IRegisterForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm = registerForm;
                return state;
            }), false, "setRegisterForm");
        },
        setResetPasswordForm: (resetPasswordForm: IResetPasswordForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm = resetPasswordForm;
                return state;
            }), false, "setResetPasswordForm");
        },

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
            // try {
                // console.log(password)
                // const response = await fetch('http://127.0.0.1:8000/api/users/', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json', // Specify JSON as the content type

                //     },
                //     credentials: 'same-origin', // Set credentials to same-origin
                //     body: JSON.stringify({ first_name, last_name, email, password, re_password }), // Convert payload to JSON string
                // });
                // if (response.status === 201) {
                //     console.log("SUCCES")
                // } else {
                //     console.log("ERROR")
                // }

                // const postData = {
                //     first_name,
                //     last_name,
                //     email,
                //     password,
                //     re_password
                // }

                // const response = await requestHandler.post('/api/users/', postData);
                // console.log(response)
            // }
            // catch (error) {
            //     console.error('Failed to register:', error);
            // }
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

