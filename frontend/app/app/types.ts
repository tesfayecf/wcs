import { Api } from "@/app/lib/api/types";

export namespace App {
    /// APP STORE ///
    export interface IAppStore {
        status: {
            isLoading: boolean;
            isWaiting: boolean;
            isError: boolean;
            isIdle: boolean;
        },
        connection: {
            isConnected: boolean;
            isReconnecting: boolean;
            isIdle: boolean;
            isError: boolean;
        },
        isAuthenticated: boolean;
        userInfo: Api.Users.User;
        permissions: any; // Api.Users.Permission[];
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