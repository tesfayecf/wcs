import { useStore } from "../store/store";

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

    public setInitialAuthInfo() {
        useStore.setState((state) => ({
            AuthStore: {
                loginForm: {
                    email: '',
                    password: '',
                },
                registerForm: {
                    name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    re_password: ''
                },
                resetPasswordForm: {
                    old_password: '',
                    password: '',
                    re_password: '',
                }
            }
        }));
        return useStore.getState().AuthStore;
    }

}

export default AuthHandler;

