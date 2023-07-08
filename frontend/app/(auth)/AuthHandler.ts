import { randomInt } from "crypto";
import { useStore } from "../store/store";
import { ILoginForm, IRegisterForm, IResetPasswordForm } from "./AuthTypes";
import { IStore } from "../store/storeTypes";
import RequestHandler from "../utils/request/requestHandler";
import { APIResponse } from "../utils/request/requestTypes";

const requestHandler = RequestHandler.getInstance();

class AuthHandler {
    private static instance: AuthHandler;
    private constructor() {
        console.log("Auth handler constructor");
    }

    public static getInstance(): AuthHandler {
        if (!AuthHandler.instance) {
            AuthHandler.instance = new AuthHandler();
        }

        console.log("Auth handler getInstance()");
        return AuthHandler.instance;
    }

    public init(): void {
        console.log("Initialising auth handler...");
    }

    public getInitialStoreData = (state: IStore) => {
        return {

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
    }

    public setInitialAuthInfo() {
        useStore.setState((state) => ({
            AuthStore: {
                ...state.AuthStore,
                store: this.getInitialStoreData(state)
            }
        }));
        return useStore.getState().AuthStore.store;
    }

    // Login Form //
    public setLoginForm(loginForm: ILoginForm) {
        useStore.getState().AuthStore.actions.setLoginForm(loginForm);
    }

    public setLoginFormEmail(email: string) {
        const isValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        useStore.getState().AuthStore.actions.setLoginFormEmail(email);
        useStore.getState().AuthStore.actions.setLoginFormEmailError(!isValid);
    }

    public setLoginFormPassword(password: string) {
        useStore.getState().AuthStore.actions.setLoginFormPassword(password);
        useStore.getState().AuthStore.actions.setLoginFormPasswordError(false);
    }


    // Register Form
    public setRegisterForm(registerForm: IRegisterForm) {
        useStore.getState().AuthStore.actions.setRegisterForm(registerForm);
    }

    public setRegisterFormFirstName(first_name: string) {
        const isValid = /^[A-Za-z]+$/.test(first_name);
        useStore.getState().AuthStore.actions.setRegisterFormFirstName(first_name);
        useStore.getState().AuthStore.actions.setRegisterFormFirstNameError(!isValid);
    }

    public setRegisterFormLastName(last_name: string) {
        const isValid = /^[A-Za-z]+$/.test(last_name);
        useStore.getState().AuthStore.actions.setRegisterFormLastName(last_name);
        useStore.getState().AuthStore.actions.setRegisterFormLastNameError(!isValid);
    }

    public setRegisterFormEmail(email: string) {
        const isValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        useStore.getState().AuthStore.actions.setRegisterFormEmail(email);
        useStore.getState().AuthStore.actions.setRegisterFormEmailError(!isValid);
    }

    public setRegisterFormPassword(password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(password);
        useStore.getState().AuthStore.actions.setRegisterFormPassword(password);
        useStore.getState().AuthStore.actions.setRegisterFormPasswordError(!isValid);
    }

    public setRegisterFormRePassword(re_password: string) {
        const isValid = re_password === useStore.getState().AuthStore.store.registerForm.password;
        useStore.getState().AuthStore.actions.setRegisterFormRePassword(re_password);
        useStore.getState().AuthStore.actions.setRegisterFormRePasswordError(!isValid);
    }


    // Reset Password Form
    public setResetPasswordForm(resetPasswordForm: IResetPasswordForm) {
        useStore.getState().AuthStore.actions.setResetPasswordForm(resetPasswordForm);
    }

    public setResetPasswordFormOldPassword(old_password: string) {
        useStore.getState().AuthStore.actions.setResetPasswordFormOldPassword(old_password);
        useStore.getState().AuthStore.actions.setResetPasswordFormOldPasswordError(false);
    }

    public setResetPasswordFormPassword(password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(password);
        useStore.getState().AuthStore.actions.setResetPasswordFormPassword(password);
        useStore.getState().AuthStore.actions.setResetPasswordFormPasswordError(!isValid);
    }

    public setResetPasswordFormRePassword(re_password: string) {
        const isValid = re_password === useStore.getState().AuthStore.store.resetPasswordForm.password;
        useStore.getState().AuthStore.actions.setResetPasswordFormRePassword(re_password);
        useStore.getState().AuthStore.actions.setResetPasswordFormRePasswordError(!isValid);
    }


    public async register() {
        try {
            const { first_name, last_name, email, password, re_password } = useStore.getState().AuthStore.store.registerForm;
            const response = await requestHandler.post<Partial<IRegisterForm>>("/api/users/", { first_name, last_name, email, password, re_password })
            if (response.status === 201) {
                console.log("SUCCES", response);
            } else {
                console.log("ERROR", response);
            }
        } catch (error) {
            // Log error
        }
    }

    public async login() {
        try {
            // const { email, password } = useStore.getState().AuthStore.store.loginForm;
            // const response = await requestHandler.post<Partial<ILoginForm>>("/api/jwt/create/", { email, password })
            // console.log(response)
            console.log(useStore.getState().AppStore.actions)


        } catch (error) {
            // Log error
            console.log(error)
        }
    }

    public async logout() {
        try {
            const response = await requestHandler.post<Partial<{}>>("/logout/", {})
            if (response.status === 201) {
                console.log("SUCCES", response);
            } else {
                console.log("ERROR", response);
            }
        } catch (error) {
            // Log error
        }
    }

    public async verify(token: string) {
        try {
            const response = await requestHandler.post<Partial<any>>("/api/jwt/verify/", {})
            // console.log("response", response);
            return true

        } catch (error) {
            // Log error
            console.log("error:", error);
            return false
        }
    }

    public async resetPassword() {
        try {
            const { email } = useStore.getState().AuthStore.store.registerForm; //Get from user info
            const response = await requestHandler.post<Partial<any>>("/users/reset_password/", { email })
            if (response.status === 201) {
                console.log("SUCCES", response);
            } else {
                console.log("ERROR", response);
            }
        } catch (error) {
            // Log error
        }
    }

    // resetPassword: async (email: string, set: any = setLocal, get: any = getLocal) => {
    //     try {
    //         const response = await fetch('/users/reset_password/', {
    //             method: 'POST',
    //             body: JSON.stringify({ email }),
    //         });
    //         // Process the reset password response as needed
    //     } catch (error) {
    //         console.error('Failed to reset password:', error);
    //     }
    // }
}

export default AuthHandler;

