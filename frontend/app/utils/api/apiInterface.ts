import { IRegisterForm } from "@/app/(auth)/AuthTypes";
import { ITankGroup } from "@/app/(pages)/dashboard/DashboardTypes";
import { ITank } from "@/app/(pages)/tanks/TanksTypes";
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
            method: "GET",
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
        getTankGroups: {
            args: (): APIResponse<ITankGroup[]> => { return {} as APIResponse<ITankGroup[]> },
            address: "api/tank-groups/",
            method: "GET",
            argsKeys: [],
        },
        getTankGroupTanks: {
            args: (tankGroupId: number): APIResponse<{ tankGroup: ITankGroup, tanks: ITank[] }> => { return {} as APIResponse<{ tankGroup: ITankGroup, tanks: ITank[] }> },
            address: "api/tank-group-tanks/",
            method: "POST",
            argsKeys: ["tankGroupId"],
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
            method: "GET",
            argsKeys: ["name", "location", "description"],
        },
        deleteTankGroup: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank-group/",
            method: "DELETE",
            argsKeys: ["tankGroupId"],
        },
        getTankGroupStats: {
            args: (tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank-group/",
            method: "GET",
            argsKeys: ["tankGroupId"],
        },
        getTank: {
            args: (tankGroupId: number): APIResponse<ITank[]> => { return {} as APIResponse<ITank[]> },
            address: "api/tanks/",
            method: "GET",
            argsKeys: ["tankGroupId"],
        },
        createTank: {
            args: (args: Partial<ITank>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/create-tank/",
            method: "POST",
            argsKeys: ["tankGroupId", "name", "capacity", "type", "brand", "material"],
        },
        editTank: {
            args: (args: Partial<ITank>): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/edit-tank/",
            method: "GET",
            argsKeys: ["tankId", "tankGroupId", "name", "capacity", "type", "brand", "material"],
        },
        deleteTank: {
            args: (tankId: number, tankGroupId: number): APIResponse<void> => { return {} as APIResponse<void> },
            address: "api/delete-tank/",
            method: "DELETE",
            argsKeys: ["tankId", "tankGroupId"],
        },
        getTankStats: {
            args: (tankId: number): APIResponse<any> => { return {} as APIResponse<any> },
            address: "api/tank-stats/",
            method: "GET",
            argsKeys: ["tankId", "tankGroupId"],
        },
        getTankSensors: {
            args: (tankId: number): APIResponse<any> => { return {} as APIResponse<any> },
            address: "api/tank-sensors/",
            method: "GET",
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