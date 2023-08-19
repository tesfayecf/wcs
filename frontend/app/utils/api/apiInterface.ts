import { IRegisterForm } from "@/app/(auth)/AuthTypes";
import { ITankGroup, ITankGroupStats } from "@/app/(pages)/dashboard/DashboardTypes";
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
    isSuccess?: boolean;
    isFailure?: boolean;
}

export const APIInterface = {
    app: {
        getUserInfo: {
            args: (): APIResponse<Partial<IUserInfo>> => { return {} as APIResponse<Partial<IUserInfo>> },
            address: "auth/user/",
            method: "POST",
            argsKeys: [],
        }
    },
    auth: {
        register: {
            args: (args: Partial<IRegisterForm>): APIResponse<string> => { return {} as APIResponse<string> },
            address: "auth/users/",
            method: "POST",
            argsKeys: ["first_name", "last_name", "email", "password", "re_password"],
        },
        login: {
            args: (email: string, password: string): APIResponse<{ access: string, refresh: string }> => { return {} as APIResponse<{ access: string, refresh: string }> },
            address: "auth/create/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/logout/",
            method: "POST",
            argsKeys: []
        },
        verify: {
            args: (): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/verify/",
            method: "POST",
            argsKeys: [],
        },
        refresh: {
            args: (obj: any): APIResponse<void> => { return {} as APIResponse<void> },
            address: "auth/refresh/",
            method: "POST",
            argsKeys: []
        },
    },
    dashboard: {

        // Summary
        getSummary: {
            args: (): APIResponse<{ summaryData: any }> => { return {} as APIResponse<{ summaryData: any }> },
            address: "api/summary/",
            method: "POST",
            argsKeys: [],
        },

        // Tank Groups
        getTankGroups: {
            args: (): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            address: "api/tank-groups/",
            method: "POST",
            argsKeys: [],
        },
        createTankGroup: {
            args: (name: string, location: string, description: string): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            address: "api/create-tank-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        editTankGroup: {
            args: (args: Partial<ITankGroup>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/edit-tank-groups/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        deleteTankGroup: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank-group/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },
        getTankGroupStats: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank-group/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },
    },

    tanks: {
        // Tanks
        getTanks: {
            args: (tankGroupId: number): APIResponse<{ tankGroup: ITankGroup, tanks: ITank[], tankGroupStats: ITankGroupStats }> => { return {} as APIResponse<{ tankGroup: ITankGroup, tanks: ITank[], tankGroupStats: ITankGroupStats }> },
            address: "api/tanks/",
            method: "POST",
            argsKeys: ["tankGroupId"],
        },

        // Tank
        getTank: {
            args: (tankId: number, tankGroupId: number): APIResponse<ITank[]> => { return {} as APIResponse<ITank[]> },
            address: "api/tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },
        createTank: {
            args: (
                tankGroupId: number, name: string, capacity: number, type: string,
                dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/create-tank/",
            method: "POST",
            argsKeys: ["tankGroupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        editTank: {
            args: (
                tankId: number, tankGroupId: number, name: string, capacity: number,
                type: string, dimensions: string, brand: string, material: string
            ): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/edit-tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId", "name", "capacity", "type", "dimensions", "brand", "material"],
        },
        deleteTank: {
            args: (tankId: number, tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },
        getTankStats: {
            args: (tankId: number, tankGroupId: number): APIResponse<any> => { return {} as APIResponse<any> },
            address: "api/tank-stats/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        },

        // Sensor
        getSensor: {
            args: (tankId: number, tankGroupId: number): APIResponse<ISensor> => { return {} as APIResponse<ISensor> },
            address: "api/sensor/",
            method: "POST",
            argsKeys: ["tankId", "tankGroupId"],
        }
    }
} as const;

/**
 * register: builder.mutation({
//             query: ({
//                 first_name,
//                 last_name,
//                 email,
//                 password,
//                 re_password,
//             }) => ({
//                 url: '/users/',
//                 method: 'POST',
//                 body: { first_name, last_name, email, password, re_password },
//             }),
//         }),
 */