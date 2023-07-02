import { create } from 'zustand';

import { AppStoreDefault, AppEndpoints } from '../app/AppStore';
import { IAppStore, IAppEndpoints } from '../app/AppTypes';

import { AuthStoreDefault, AuthEndpoints } from '../auth/AuthStore';
import { IAuthStore, IAuthEndpoints } from '../auth/AuthTypes';

import { DashboardStoreDefault, DashboardEndpoints } from '../dashboard/DashboardStore';
import { IDashboardStore, IDashboardEndpoints } from '../dashboard/DashboardTypes';


interface Store {
    AppStore: {
        store: IAppStore,
        endpoints: IAppEndpoints,
    };
    AuthStore: {
        store: IAuthStore,
        endpoints: IAuthEndpoints,
    };
    DashboardStore: {
        store: IDashboardStore,
        endpoints: IDashboardEndpoints,
    }
}

export const useStore = create<Store>((set, get) => {
    return {
        AppStore: {
            store: AppStoreDefault,
            endpoints: AppEndpoints
        },
        AuthStore: {
            store: AuthStoreDefault,
            endpoints: AuthEndpoints,
        },
        DashboardStore: {
            store: DashboardStoreDefault,
            endpoints: DashboardEndpoints,
        },
    };
});