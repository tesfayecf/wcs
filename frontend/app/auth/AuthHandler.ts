import { useStore } from "../store/store";
import { IRegisterForm } from "./AuthTypes";

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

    public getInitialStoreData = () => {
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
                store: this.getInitialStoreData()
            }
        }));
        return useStore.getState().AuthStore.store;
    }

    public setRegisterForm(registerForm: IRegisterForm) {
        useStore.getState().AuthStore.endpoints.setRegisterForm(registerForm);
    }
}

export default AuthHandler;

