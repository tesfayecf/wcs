import { IAppStore, IAppActions } from '@/app/app/AppTypes';
import { IAuthStore, IAuthActions } from '@/app/(auth)/AuthTypes';
import { IDashboardStore, IDashboardActions } from '@/app/(pages)/dashboard/DashboardTypes';

export interface IStore {
    app: IAppStore;
    auth: IAuthStore;
    dashboard: IDashboardStore;
}

// export type IAppStore = IAppStore;
// export import IAppActions = IAppActions;

// export type IAuthStore = IAuthStore;
// export type IAuthActions = IAuthActions;

// export type IDashboardStore = IDashboardStore;
// export type IDashboardActions = IDashboardActions;
