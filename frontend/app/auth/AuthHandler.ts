import { randomInt } from "crypto";
import { useStore } from "../store/store";
import { IRegisterForm } from "./AuthTypes";
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

    // Login Form
    public setLoginFormEmail(email: string) {
        const isValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        useStore.getState().AuthStore.endpoints.setLoginFormEmail(email);
        useStore.getState().AuthStore.endpoints.setLoginFormEmailError(!isValid);
    }

    public setLoginFormPassword(password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(password);
        useStore.getState().AuthStore.endpoints.setLoginFormPassword(password);
        useStore.getState().AuthStore.endpoints.setLoginFormPasswordError(!isValid);
    }


    // Register Form
    public setRegisterFormFirstName(first_name: string) {
        const isValid = /^[A-Za-z]+$/.test(first_name);
        useStore.getState().AuthStore.endpoints.setRegisterFormFirstName(first_name);
        useStore.getState().AuthStore.endpoints.setRegisterFormFirstNameError(!isValid);
        console.log(useStore.getState().AuthStore.store.registerForm.first_nameError);
    }

    public setRegisterFormLastName(last_name: string) {
        const isValid = /^[A-Za-z]+$/.test(last_name);
        useStore.getState().AuthStore.endpoints.setRegisterFormLastName(last_name);
        useStore.getState().AuthStore.endpoints.setRegisterFormLastNameError(!isValid);
    }

    public setRegisterFormEmail(email: string) {
        const isValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        useStore.getState().AuthStore.endpoints.setRegisterFormEmail(email);
        useStore.getState().AuthStore.endpoints.setRegisterFormEmailError(!isValid);
    }

    public setRegisterFormPassword(password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(password);
        useStore.getState().AuthStore.endpoints.setRegisterFormPassword(password);
        useStore.getState().AuthStore.endpoints.setRegisterFormPasswordError(!isValid);
    }

    public setRegisterFormRePassword(re_password: string) {
        const isValid = re_password === useStore.getState().AuthStore.store.registerForm.password;
        useStore.getState().AuthStore.endpoints.setRegisterFormRePassword(re_password);
        useStore.getState().AuthStore.endpoints.setRegisterFormRePasswordError(!isValid);
    }


    // Reset Password Form
    public setResetPasswordFormOldPassword(old_password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(old_password);
        useStore.getState().AuthStore.endpoints.setResetPasswordFormOldPassword(old_password);
        useStore.getState().AuthStore.endpoints.setResetPasswordFormOldPasswordError(!isValid);
    }

    public setResetPasswordFormPassword(password: string) {
        const isValid = /^[A-Za-z0-9!@#$%^&*()_]{6,}$/.test(password);
        useStore.getState().AuthStore.endpoints.setResetPasswordFormPassword(password);
        useStore.getState().AuthStore.endpoints.setResetPasswordFormPasswordError(!isValid);
    }

    public setResetPasswordFormRePassword(re_password: string) {
        const isValid = re_password === useStore.getState().AuthStore.store.resetPasswordForm.password;
        useStore.getState().AuthStore.endpoints.setResetPasswordFormRePassword(re_password);
        useStore.getState().AuthStore.endpoints.setResetPasswordFormRePasswordError(!isValid);
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
}

export default AuthHandler;

