'use client'
import { store } from "../lib/store/store";
import { appActions } from "@/app/app/AppReducer";
import RequestManager from "@/app/lib/api/requestManager";

const requestManager = RequestManager.getInstance();
class AppHandler {
    private static instance: AppHandler;
    private constructor() { }

    public static getInstance(): AppHandler {
        if (!AppHandler.instance) {
            AppHandler.instance = new AppHandler();
        }
        return AppHandler.instance;
    }

    public load() {

    }

    public unload() {

    }

    // public setIsLoading() {
    //     store.dispatch(appActions.setIsLoading());
    // }

    // public setIsNotLoading() {
    //     store.dispatch(appActions.setIsNotLoading())
    // }

    // public setIsAuthenticated() {
    //     store.dispatch(appActions.setIsAuthenticated());
    // }

    // public setIsNotAuthenticated() {
    //     store.dispatch(appActions.setIsNotAuthenticated());
    // }

    public async getUserInfo() {
        const userInfo = await requestManager.request("user", "getUserInfo", []);
        store.dispatch(appActions.setUserInfo({
            id: userInfo.data.id,
            email: userInfo.data.email,
            first_name: userInfo.data.first_name,
            role: userInfo.data.role,
            last_name: userInfo.data.last_name,
            status: "active"
        }));
    }
}

export default AppHandler;

// dummy app user session info 
const userSessionInfo: any = {
    user: {
        id: 1,
        name: 'John Doe',
        email: 'tesfayecarreras02@gmail.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2021-01-01',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
}
