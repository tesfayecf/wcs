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

interface ITankCreationForm {
    name: string;
    capacity: number;
    type: string;
    dimension: string;
    material: string;
    brand: string;
}

export interface DashboardStore {
    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
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
            showAddTankMenu: false,
            tankCreationForm: {
                name: '',
                type: '',
                capacity: 0,
                dimension: '',
                material: '',
                brand: '',
            }
        },
        AnalyticsStore: {}
    }
})


