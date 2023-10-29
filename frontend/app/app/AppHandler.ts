'use client'
import { store } from "../utils/store/store";
import { appActions } from "@/app/app/AppReducer";
import RequestManager from "@/app/utils/api/requestManager";

const requestManager = RequestManager.getInstance();
class AppHandler {
    private static instance: AppHandler;
    private constructor() {
        console.log("App handler constructor");
    }

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

    public setAuth() {
        store.dispatch(appActions.setAuth());
    }

    public logOut() {
        store.dispatch(appActions.logout());
    }

    public finishInitialLoad() {
        store.dispatch(appActions.finishLoading());
    }

    public async getUserInfo() {
        const userInfo = await requestManager.request("app", "getUserInfo", []);
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
