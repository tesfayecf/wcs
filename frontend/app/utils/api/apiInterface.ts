import { IRegisterForm, IResetPasswordForm } from "@/app/(auth)/AuthTypes";
import { IGroup, IGroupStats } from "@/app/(pages)/dashboard/DashboardTypes";
import { ISensor, ITank } from "@/app/(pages)/group/GroupTypes";
import { IUserInfo } from "@/app/app/AppTypes";

export interface APIResponse<T> {
    data?: T;
    error?: any;
    request?: any;
    status?: number;
    statusText?: string;
    headers?: any;
    config?: any;
    isSuccess?: boolean,
    isRedirect?: boolean,
    isClientError?: boolean,
    isServerError?: boolean,
}

export const APIInterface = {
    app: {
        getUserInfo: {
            args: (): APIResponse<Partial<IUserInfo>> => { return {} as APIResponse<Partial<IUserInfo>> },
            address: "api/auth/user/",
            method: "POST",
            argsKeys: [],
        }
    },
    auth: {
        signup: {
            args: (args: Partial<IRegisterForm>): APIResponse<string> => { return {} as APIResponse<string> },
            address: "api/auth/signup/",
            method: "POST",
            argsKeys: ["firstName", "lastName", "email", "password", "rePassword"],
        },
        login: {
            args: (email: string, password: string): APIResponse<{ access: string, refresh: string }> => { return {} as APIResponse<{ access: string, refresh: string }> },
            address: "api/auth/login/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/logout/",
            method: "POST",
            argsKeys: []
        },
        reset: {
            args: (args: Partial<IResetPasswordForm>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/reset/",
            method: "POST",
            argsKeys: ["oldPassword", "password", "rePassword"],
        },
        verify: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/verify/",
            method: "POST",
            argsKeys: [],
        },
        refresh: {
            args: (obj: any): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/refresh/",
            method: "POST",
            argsKeys: []
        },
    },
    dashboard: {

        // Summary
        getSummary: {
            args: (): APIResponse<{ summaryData: any }> => { return {} as APIResponse<{ summaryData: any }> },
            address: "api/tanks/summary/",
            method: "POST",
            argsKeys: [],
        },

        // Groups
        getGroups: {
            args: (): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/tanks/groups/",
            method: "POST",
            argsKeys: [],
        },
        createGroup: {
            args: (name: string, location: string, description: string): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/tanks/create-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        editGroup: {
            args: (args: Partial<IGroup>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/edit-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        deleteGroup: {
            args: (groupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-group/",
            method: "POST",
            argsKeys: ["groupId"],
        },
        getGroupStats: {
            args: (groupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-group/",
            method: "POST",
            argsKeys: ["groupId"],
        },
    },

    tanks: {
        // Tanks
        getTanks: {
            args: (groupId: number): APIResponse<{ group: IGroup, tanks: ITank[], groupStats: IGroupStats }> => { return {} as APIResponse<{ group: IGroup, tanks: ITank[], groupStats: IGroupStats }> },
            address: "api/tanks/tanks/",
            method: "POST",
            argsKeys: ["groupId"],
        },

        // Tank
        getTank: {
            args: (tankId: number, groupId: number): APIResponse<ITank[]> => { return {} as APIResponse<ITank[]> },
            address: "api/tanks/tank/",
            method: "POST",
            argsKeys: ["tankId", "groupId"],
        },
        createTank: {
            args: (
                groupId: number, name: string, capacity: number, type: string,
                dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/create-tank/",
            method: "POST",
            argsKeys: ["groupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        editTank: {
            args: (
                tankId: number, groupId: number, name: string, capacity: number,
                type: string, dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/edit-tank/",
            method: "POST",
            argsKeys: ["tankId", "groupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        deleteTank: {
            args: (tankId: number, groupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-tank/",
            method: "POST",
            argsKeys: ["tankId", "groupId"],
        },
        getTankStats: {
            args: (tankId: number, groupId: number): APIResponse<any> => { return {} as APIResponse<any> },
            address: "api/tanks/tank-stats/",
            method: "POST",
            argsKeys: ["tankId", "groupId"],
        },

        // Sensor
        getSensor: {
            args: (tankId: number, groupId: number): APIResponse<ISensor> => { return {} as APIResponse<ISensor> },
            address: "api/tanks/sensor/",
            method: "POST",
            argsKeys: ["tankId", "groupId"],
        },
        assignSensor: {
            args: (sensorId: number, tankId: number, groupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/assign-sensor/",
            method: "POST",
            argsKeys: ["sensorId", "tankId", "groupId"]
        }
    }
} as const;