import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AppStoreDefault, getAppEndpoints } from '../app/AppStore';
import { IAppStore, IAppEndpoints } from '../app/AppTypes';

import { AuthStoreDefault, getAuthEndpoints } from '../auth/AuthStore';
import { IAuthStore, IAuthEndpoints } from '../auth/AuthTypes';

import { DashboardStoreDefault, getDashboardEndpoints } from '../dashboard/DashboardStore';
import { IDashboardStore, IDashboardEndpoints } from '../dashboard/DashboardTypes';

import { IStore } from './storeTypes';




export const useStore = create<IStore>()(
    devtools(
        (set, get) => {
        return {
            AppStore: {
                store: AppStoreDefault,
                endpoints: getAppEndpoints(set, get),
            },
            AuthStore: {
                store: AuthStoreDefault,
                endpoints: getAuthEndpoints(set, get),
            },
            DashboardStore: {
                store: DashboardStoreDefault,
                endpoints: getDashboardEndpoints(set, get),
            },
        };
    }));