import { IRecoverForm, ISignupForm } from "@/app/(auth)/AuthTypes";
import { IGroup, IGroupStats } from "@/app/(pages)/dashboard/DashboardTypes";
import { ISensor, ITank } from "@/app/(pages)/group/[groupId]/GroupTypes";
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
            args: (args: Partial<ISignupForm>): APIResponse<string> => { return {} as APIResponse<string> },
            address: "api/auth/signup/",
            method: "POST",
            argsKeys: ["firstName", "lastName", "email", "password", "confirmPassword"],
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
            args: (args: Partial<IRecoverForm>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/reset/",
            method: "POST",
            argsKeys: ["oldPassword", "newPassword", "confirmPassword"],
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
        // getSummary: {
        //     args: (): APIResponse<{ summaryData: any }> => { return {} as APIResponse<{ summaryData: any }> },
        //     address: "api/data/summary/",
        //     method: "POST",
        //     argsKeys: [],
        // },

        // Groups
        getGroups: {
            args: (): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/data/groups/",
            method: "POST",
            argsKeys: [],
        },
        createGroup: {
            args: (name: string, location: string, description: string): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/data/create-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        editGroup: {
            args: (id: number, name: string, location: string, description: string): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/edit-group/",
            method: "POST",
            argsKeys: ["id", "name", "location", "description"],
        },
        deleteGroup: {
            args: (id: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/delete-group/",
            method: "POST",
            argsKeys: ["id"],
        },
        // getGroupStats: {
        //     args: (groupId: number): APIResponse<void> => { return {} as APIResponse<void> },
        //     address: "api/data/group-stats/",
        //     method: "POST",
        //     argsKeys: ["groupId"],
        // },
    },

    tanks: {
        // Tanks
        getTanks: {
            args: (group_id: number): APIResponse<ITank[]> => { return {} as APIResponse<ITank[]> },
            address: "api/data/tanks/",
            method: "POST",
            argsKeys: ["group_id"],
        },
        createTank: {
            args: (group_id: number, name: string, type: string, capacity: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/create-tank/",
            method: "POST",
            argsKeys: ["group_id", "name", "type", "capacity"],
        },
        editTank: {
            args: (id: number, group_id: number, name: string, type: string, capacity: number, is_active: boolean): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/edit-tank/",
            method: "POST",
            argsKeys: ["id", "group_id", "name", "type", "capacity", "is_active"],
        },
        deleteTank: {
            args: (id: number, group_id: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/delete-tank/",
            method: "POST",
            argsKeys: ["id", "group_id"],
        },
        // getTankStats: {
        //     args: (tankId: number, groupId: number): APIResponse<any> => { return {} as APIResponse<any> },
        //     address: "api/data/tank-stats/",
        //     method: "POST",
        //     argsKeys: ["tankId", "groupId"],
        // },

        // Sensor
        getSensor: {
            args: (tank_id: number, group_id: number): APIResponse<ISensor> => { return {} as APIResponse<ISensor> },
            address: "api/data/sensor/",
            method: "POST",
            argsKeys: ["tank_id", "group_id"],
        },
        createSensor: {
            args: (tank_id: number, group_id: number, token: string): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/create-sensor/",
            method: "POST",
            argsKeys: ["tank_id", "group_id", "token"],
        },
        editSensor: {
            args: (id: number, tank_id: number, group_id: number, token: string, is_active: boolean): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/edit-sensor/",
            method: "POST",
            argsKeys: ["id", "tank_id", "group_id", "token", "is_active"],
        },
        deleteSensor: {
            args: (id: number, tank_id: number, group_id: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/data/delete-sensor/",
            method: "POST",
            argsKeys: ["id", "tank_id", "group_id"],
        }
    }
} as const;