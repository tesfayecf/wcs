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
                first_name: 'fefasdfadscasdcasdfds',
                first_nameError: false,
                last_name: 'ferfefewfadsfasdf',
                last_nameError: false,
                email: 'adfcfqewfasdx3@gmail.com',
                emailError: false,
                password: 'qwertyuiopasdfghjklñzxcvbnm',
                passwordError: false,
                re_password: 'qwertyuiopasdfghjklñzxcvbnm',
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

    // Fer un set per a cada field i utilitzar el set error per al handler del request

    public setRegisterForm(registerForm: IRegisterForm) {
        useStore.getState().AuthStore.endpoints.setRegisterForm(registerForm);
    }

    public async register() {
        const { first_name, last_name, email, password, re_password } = useStore.getState().AuthStore.store.registerForm;
        try {
            const response = await requestHandler.post<Partial<IRegisterForm>>("/api/users/", { first_name, last_name, email, password, re_password })
            console.log("SUCCES" ,response);

        } catch (error: unknown) {
            let data = error as APIResponse<Partial<IRegisterForm>>
            console.log("ERROR" ,data.error?.data?.email);
        }
        // useStore.getState().AuthStore.endpoints.register(first_name, last_name, email, password, re_password);

    }
}

export default AuthHandler;

