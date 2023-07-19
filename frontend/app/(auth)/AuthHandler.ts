import { appActions } from "../app/AppReducer";
import { store } from "../utils/store/store";
import { authActions } from "./AuthReducer";
import { ILoginForm } from "./AuthTypes";
import RequestManager from '@/app/utils/api/requestManager'
import { useRouter } from 'next/navigation';

const requestManager = RequestManager.getInstance();
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

    //////////////////
    //// Setters /////
    //////////////////


    // Login Form //
    public setLoginForm(loginForm: ILoginForm) {
        store.dispatch(authActions.setLoginForm(loginForm))
    }

    // Login
    public setLoginFormEmail(email: string) {
        const error = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        store.dispatch(authActions.setLoginFormEmail({ email, error: !error }));
    }

    public setLoginFormPassword(password: string) {
        store.dispatch(authActions.setLoginFormPassword({ password, error: false }));
    }

    // Register
    public setRegisterFormFirstName(firstName: string) {
        // Validation or additional logic if needed
        store.dispatch(authActions.setRegisterFormFirstName({ firstName, error: false }));
    }

    public setRegisterFormLastName(lastName: string) {
        // Validation or additional logic if needed
        store.dispatch(authActions.setRegisterFormLastName({ lastName, error: false }));
    }

    public setRegisterFormEmail(email: string) {
        const error = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        store.dispatch(authActions.setRegisterFormEmail({ email, error: !error }));
    }

    public setRegisterFormPassword(password: string) {
        const error = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
        store.dispatch(authActions.setRegisterFormPassword({ password, error: !error }));
    }

    public setRegisterFormRePassword(rePassword: string) {
        const error = store.getState().auth.registerForm.password !== rePassword;
        store.dispatch(authActions.setRegisterFormRePassword({ rePassword, error: !error }));
    }

    // Reset
    public setResetPasswordFormOldPassword(oldPassword: string) {
        store.dispatch(authActions.setResetPasswordFormOldPassword({ oldPassword, error: false }));
    }

    public setResetPasswordFormPassword(password: string) {
        const error = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
        store.dispatch(authActions.setResetPasswordFormPassword({ password, error: false }));
    }

    public setResetPasswordFormRePassword(rePassword: string) {
        // Validation or additional logic if needed
        store.dispatch(authActions.setResetPasswordFormRePassword({ rePassword, error: false }));
    }


    public async register() {
        const state = store.getState();
        const firstName = state.auth.registerForm.firstName;
        const lastName = state.auth.registerForm.lastName;
        const email = state.auth.registerForm.email;
        const password = state.auth.registerForm.password;
        const rePassword = state.auth.registerForm.rePassword;

        const response = await requestManager.request("auth", "register", [{ firstName, lastName, email, password, rePassword }], false)
        return response;
    }


    public async login() {
        const state = store.getState();
        const email = state.auth.loginForm.email;
        const password = state.auth.loginForm.password;

        const response = await requestManager.request("auth", "login", [email, password], false)
        if (response.status === 200) {
            store.dispatch(appActions.setRefreshToken(response.data.refresh))
            store.dispatch(appActions.setAccessToken(response.data.access))
        }
        return response;
    }

    public async logout() {
        try {
            const response = await requestManager.request("auth", "logout", [], false)
        } catch (error) {
            // Log error
        }
    }

    // public async verify(token: string) {
    //     try {
    //         // const response = await requestHandler.post<Partial<any>>("/api/jwt/verify/", {})
    //         // console.log("response", response);
    //         // return true

    //     } catch (error) {
    //         // Log error
    //         // console.log("error:", error);
    //         // return false
    //     }
    // }


    // public async resetPassword() {
    //     try {
    //         const { email } = useStore.getState().AuthStore.store.registerForm; //Get from user info
    //         const response = await requestHandler.post<Partial<any>>("/users/reset_password/", { email })
    //         if (response.status === 201) {
    //             console.log("SUCCES", response);
    //         } else {
    //             console.log("ERROR", response);
    //         }
    //     } catch (error) {
    //         // Log error
    //     }
    // }
}

export default AuthHandler;

