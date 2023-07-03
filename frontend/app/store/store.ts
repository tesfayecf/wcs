import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AppStoreDefault, AppEndpoints } from '../app/AppStore';
import { IAppStore, IAppEndpoints } from '../app/AppTypes';

import { AuthStoreDefault, AuthEndpoints } from '../auth/AuthStore';
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
                // endpoints: AppEndpoints
            },
            AuthStore: {
                store: AuthStoreDefault,
                // endpoints: AuthEndpoints,
            },
            DashboardStore: {
                store: DashboardStoreDefault,
                endpoints: getDashboardEndpoints(set, get),
            },
        };
    }));