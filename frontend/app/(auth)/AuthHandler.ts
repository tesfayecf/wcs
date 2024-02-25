import { appActions } from "../app/AppReducer";
import { store } from "../lib/store/store";
import { ILoginForm, ISignupForm, IResetForm } from "@/app/(auth)/AuthTypes";
import RequestManager from '@/app/lib/api/requestManager'

const requestManager = RequestManager.getInstance();

class AuthHandler {
    private static instance: AuthHandler;
    private constructor() { }

    public static getInstance(): AuthHandler {
        if (!AuthHandler.instance) {
            AuthHandler.instance = new AuthHandler();
        }
        return AuthHandler.instance;
    }

    public async load() { }


    public async unload() { }

    // SIGN UP
    public async signup(fields: ISignupForm) {
        try {
            const firstName = fields.firstName;
            const lastName = fields.lastName;
            const email = fields.email;
            const password = fields.password
            const confirmPassword = fields.confirmPassword

            const response = await requestManager.request("auth", "signup", [firstName, lastName, email, password, confirmPassword], false)

            if (response.isSuccess) {
            } else {
                throw new Error("Error during sign up")
            }
            return response;
        } catch (error) {
            // Log error
        }
    }

    // LOGIN
    public async login(fields: ILoginForm) {
        try {
            const email = fields.email
            const password = fields.password;

            const response = await requestManager.request("auth", "login", [email, password], false);
            if (response.isSuccess) {
                store.dispatch(appActions.setRefreshToken({ refreshToken: response.data.refresh }));
                store.dispatch(appActions.setAccessToken({ accesToken: response.data.access }));
            } else {
                throw new Error("Error during log in")
            }
            return response;
        } catch (error) {
            // Log error
        }
    }

    // LOGOUT
    public async logout() {
        try {
            const response = await requestManager.request("auth", "logout", []);

            if (response.isSuccess) {
                store.dispatch(appActions.removeRefreshToken())
                store.dispatch(appActions.removeAccesToken())
            } else {
                throw new Error("Error during log out")
            }
        } catch (error) {
            // Log error
        }
    }

    // RESET PASSWORD
    public async resetPassword(fields: IResetForm) {
        try {
            const oldPassword = fields.oldPassword;
            const newPassword = fields.newPassword;
            const confirmPassword = fields.confirmPassword;

            const response = await requestManager.request("auth", "reset", [oldPassword, newPassword, confirmPassword]);

            if (response.isSuccess) {
            } else {
                throw new Error("Error during sign up")
            }
            return response;
        } catch (error) {
            // Log error
        }
    }
}

export default AuthHandler;

