import { create } from 'zustand'

interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    avatar: string;
}

export interface AppStore {
    checkValue: number;
    userInfo: UserInfo;
}

interface LoginStore { }

interface UserStore { }

export interface DashboardStore {
    showAddTankMenu: boolean;
}

interface AnalyticsStore { }

interface Store {
    AppStore: AppStore,
    LoginStore: LoginStore,
    UserStore: UserStore,
    DashboardStore: DashboardStore,
    AnalyticsStore: AnalyticsStore,
}

export const useStore = create<Store>((set: any, get: any) => {
    return {
        AppStore: {
            checkValue: 0,
            userInfo: {
                id: -1,
                name: '',
                email: '',
                role: '',
                status: '',
                lastLogin: '',
                avatar: ''
            }
        },
        LoginStore: {},
        UserStore: {},
        DashboardStore: {
            showAddTankMenu: false
        },
        AnalyticsStore: {}
    }
})


