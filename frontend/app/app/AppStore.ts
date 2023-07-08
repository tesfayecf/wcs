import { produce } from "immer";
import { IStore } from "../store/storeTypes";
import { IAppActions, IAppStore } from "./AppTypes";

export const AppStoreDefault: IAppStore = {
    isAuthenticated: false,
    isLoading: false,
    isConnected: false,

    isAdmin: false,
    isStaff: false,
    isUser: false,
    checkValue: 0,
    userInfo: {
        id: -1,
        name: '',
        email: '',
        role: 'user',
        status: 'inactive',
        lastLogin: '',
    }
}

export function getAppActions(setLocal: any, getLocal: any): IAppActions {
    return {
        startAuthentication: (set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AppStore.store.isLoading = true;
                return state;
            }), false, "startAuthentication");
        },
        finishAuthentication: (set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AppStore.store.isLoading = false;
                return state;
            }), false, "finishInitialLoad");
        },
        setAuth: (set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AppStore.store.isAuthenticated = true;
                return state;
            }), false, "setAuth");
        },
        logout: (set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AppStore.store.isAuthenticated = false;
                return state;
            }), false, "logout");
        }
    }
}