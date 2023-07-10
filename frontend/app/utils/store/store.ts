import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AppStoreDefault, getAppActions } from '../../app/AppStore';
import { AuthStoreDefault, getAuthActions } from '../../(auth)/AuthStore';
import { DashboardStoreDefault, getDashboardActions } from '../../(pages)/dashboard/DashboardStore';

import { IStore } from './storeTypes';




export const useStore = create<IStore>()(
    devtools(
        (set, get) => {
            return {
                AppStore: {
                    store: AppStoreDefault,
                    actions: getAppActions(set, get),
                },
                AuthStore: {
                    store: AuthStoreDefault,
                    actions: getAuthActions(set, get),
                },
                DashboardStore: {
                    store: DashboardStoreDefault,
                    actions: getDashboardActions(set, get),
                },
            };
        }
    )
);