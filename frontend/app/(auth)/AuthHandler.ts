import { appActions } from "../app/AppReducer";
import { store } from "../utils/store/store";
import { authActions } from "@/app/(auth)/AuthReducer";
import { ILoginForm, ILoginFormN, IRegisterFormN, IResetPasswordFormN } from "@/app/(auth)/AuthTypes";
import RequestManager from '@/app/utils/api/requestManager'

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
        return AuthHandler.instance;
    }

    public async load() {
        // check user data
        store.dispatch(appActions.finishLoading())
    }


    public async unload() { }

    // REGISTER

    public async signup(fields: IRegisterFormN) {
        try {
            const firstName = fields["firstName"];
            const lastName = fields["lastName"];
            const email = fields["email"];
            const password = fields["password"];
            const rePassword = fields["cPassword"];
            store.dispatch(appActions.startLoading());

            const response = await requestManager.request("auth", "signup", [{ firstName, lastName, email, password, rePassword }], false)

            if (response.isSuccess) {
            } else {
                throw new Error("Error during log in")
            }

            store.dispatch(appActions.finishLoading());
            return response;
        } catch (error) {
            // Log error
        }
    }

    // LOGIN

    public async login(fields: ILoginFormN) {
        try {
            const email = fields["email"];
            const password = fields["password"];
            store.dispatch(appActions.startLoading());

            const response = await requestManager.request("auth", "login", [email, password], false);
            if (response.isSuccess) {
                store.dispatch(appActions.setRefreshToken(response.data.refresh));
                store.dispatch(appActions.setAccessToken(response.data.access));
            } else {
                throw new Error("Error during log in")
            }

            store.dispatch(appActions.finishLoading());
            return response;
        } catch (error) {
            // Log error
        }
    }

    // LOGOUT

    public async logout() {
        try {
            store.dispatch(appActions.startLoading())
            const response = await requestManager.request("auth", "logout", [], false);

            if (response.isSuccess) {
                store.dispatch(appActions.removeRefreshToken())
                store.dispatch(appActions.removeAccesToken())
            } else {
                throw new Error("Error during log out")
            }

            store.dispatch(appActions.finishLoading())
        } catch (error) {
            // Log error
        }
    }

    // RESET PASSWORD

    public async resetPassword(filds: IResetPasswordFormN) {
        try {

        } catch (error) {
            // Log error
        }
    }
}

export default AuthHandler;

