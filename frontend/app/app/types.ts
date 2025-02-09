import { Api } from "@/app/lib/api/types";

export namespace App {
    /// APP STORE ///
    export interface IAppStore {
        status: {
            isLoading: boolean;
            isWaiting: boolean;
            isIdle: boolean;
            isError: boolean;
        },
        connection: {
            isConnected: boolean;
            isConnecting: boolean;
            isIdle: boolean;
            isError: boolean;
        },
        permissions: {
            isAuthenticated: boolean;
            isAdmin: boolean;
        }, // IPermissions -> Api.Users.Permission[]
        user: IUser;
    }

    /// USER ///
    export type IUser = Api.Users.User;

    export interface IUserMenu {
        show: boolean;
        mode: "create" | "edit" | "delete" | "";
        id: number;
    }

    /// PERMISSIONS ///
    export type IPermissions = any;// Api.Users.Permission[];
}