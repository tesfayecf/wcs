import { IRegisterForm } from "@/app/(auth)/AuthTypes";
import { IGroup, ITankGroupStats } from "@/app/(pages)/dashboard/DashboardTypes";
import { ISensor, ITank } from "@/app/(pages)/tanks/TanksTypes";
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
        register: {
            args: (args: Partial<IRegisterForm>): APIResponse<string> => { return {} as APIResponse<string> },
            address: "api/auth/users/",
            method: "POST",
            argsKeys: ["first_name", "last_name", "email", "password", "re_password"],
        },
        login: {
            args: (email: string, password: string): APIResponse<{ access: string, refresh: string }> => { return {} as APIResponse<{ access: string, refresh: string }> },
            address: "api/auth/create/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/auth/logout/",
            method: "POST",
            argsKeys: []
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

        // Tank Groups
        getTankGroups: {
            args: (): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/tanks/tank-groups/",
            method: "POST",
            argsKeys: [],
        },
        createTankGroup: {
            args: (name: string, location: string, description: string): APIResponse<IGroup[]> => { return {} as APIResponse<IGroup[]> },
            address: "api/tanks/create-tank-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        editTankGroup: {
            args: (args: Partial<IGroup>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/edit-tank-groups/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        deleteTankGroup: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-tank-group/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },
        getTankGroupStats: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-tank-group/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },
    },

    tanks: {
        // Tanks
        getTanks: {
            args: (tankGroupId: number): APIResponse<{ tankGroup: IGroup, tanks: ITank[], tankGroupStats: ITankGroupStats }> => { return {} as APIResponse<{ tankGroup: IGroup, tanks: ITank[], tankGroupStats: ITankGroupStats }> },
            address: "api/tanks/tanks/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },

        // Tank
        getTank: {
            args: (tankId: number, tankGroupId: number): APIResponse<ITank[]> => { return {} as APIResponse<ITank[]> },
            address: "api/tanks/tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },
        createTank: {
            args: (
                tankGroupId: number, name: string, capacity: number, type: string,
                dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/create-tank/",
            method: "POST",
            argsKeys: ["tankGroupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        editTank: {
            args: (
                tankId: number, tankGroupId: number, name: string, capacity: number,
                type: string, dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/edit-tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        deleteTank: {
            args: (tankId: number, tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/delete-tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },
        getTankStats: {
            args: (tankId: number, tankGroupId: number): APIResponse<any> => { return {} as APIResponse<any> },
            address: "api/tanks/tank-stats/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },

        // Sensor
        getSensor: {
            args: (tankId: number, tankGroupId: number): APIResponse<ISensor> => { return {} as APIResponse<ISensor> },
            address: "api/tanks/sensor/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },
        assignSensor: {
            args: (sensorId: number, tankId: number, tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/tanks/assign-sensor/",
            method: "POST",
            argsKeys: ["sensorId", "tankId", "tankGroupId"]
        }
    }
} as const;