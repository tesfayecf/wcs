import { create } from 'zustand'
import { AppStore } from '../app/AppTypes';
import { AuthStore } from '../auth/AuthTypes';
import { DashboardStore } from '../dashboard/DashboardTypes';

interface AnalyticsStore { }

interface Store {
    AppStore: AppStore,
    AuthStore: AuthStore,
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
                role: 'user',
                status: 'inactive',
                lastLogin: '',
            }
        },
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
        },
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


