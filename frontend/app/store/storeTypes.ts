import { IAppStore } from "../app/AppTypes";
import { IAuthStore } from "../auth/AuthTypes";
import { IDashboardEndpoints, IDashboardStore } from "../dashboard/DashboardTypes";


export interface IStore {
    AppStore: {
        store: IAppStore,
        // endpoints: IAppEndpoints,
    };
    AuthStore: {
        store: IAuthStore,
        // endpoints: IAuthEndpoints,
    };
    DashboardStore: {
        store: IDashboardStore,
        endpoints: IDashboardEndpoints,
    }
}