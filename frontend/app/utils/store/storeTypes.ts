import { IAppActions, IAppStore } from "../../app/AppTypes";
import { IAuthActions, IAuthStore } from "../../(auth)/AuthTypes";
import { IDashboardActions, IDashboardStore } from "../../(pages)/dashboard/DashboardTypes";


export interface IStore {
    AppStore: {
        store: IAppStore,
        actions: IAppActions,
    };
    AuthStore: {
        store: IAuthStore,
        actions: IAuthActions,
    };
    DashboardStore: {
        store: IDashboardStore,
        actions: IDashboardActions,
    }
}