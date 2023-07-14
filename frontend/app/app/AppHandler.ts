'use client'

import { store } from "../utils/store/store";
import { appActions } from "./AppReducer";

class AppHandler {
    private static instance: AppHandler;
    private constructor() {
        console.log("App handler constructor");
    }

    public static getInstance(): AppHandler {
        if (!AppHandler.instance) {
            AppHandler.instance = new AppHandler();
        }
        console.log("App handler getInstance()");
        return AppHandler.instance;
    }

    public init(): void {
        console.log("Initialising app handler...");
    }

    public setAuth() {
        store.dispatch(appActions.setAuth());
    }

    public logOut() {
        store.dispatch(appActions.logout());
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
