import { ILoginForm, IResetForm, ISignupForm } from "@/app/(auth)/types";
import { IGroup, IGroupStats } from "@/app/(main)/dashboard/types";
import { ISensor, ITank } from "@/app/(main)/group/[groupId]/types";
import { IUserInfo } from "@/app/app/types";

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

export const apiInterface = {
    app: {},
    auth: {
        signup: {
            args: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => { return {} as string },
            address: "api/auth/signup/",
            method: "POST",
            argsKeys: ["firstName", "lastName", "email", "password", "confirmPassword"],
        },
        login: {
            args: (email: string, password: string) => { return {} as { access: string, refresh: string } },
            address: "api/auth/login/",
            method: "POST",
            argsKeys: ["email", "password"],
        },
        logout: {
            args: () => { return }, // void
            address: "api/auth/logout/",
            method: "POST",
            argsKeys: []
        },
        reset: {
            args: (oldPassword: string, newPassword: string, confirmPassword: string) => { return },
            address: "api/auth/reset/",
            method: "POST",
            argsKeys: ["oldPassword", "newPassword", "confirmPassword"],
        },
        verify: {
            args: (token: string) => { return },
            address: "api/auth/verify/",
            method: "POST",
            argsKeys: ["token"],
        },
        refresh: {
            args: () => { return {} as { access: string } },
            address: "api/auth/refresh/",
            method: "POST",
            argsKeys: []
        },
    },
    user: {
        getUserInfo: {
            args: () => { return {} as IUserInfo },
            address: "api/auth/user/",
            method: "POST",
            argsKeys: [],
        }
    },
    group: {
        getGroups: {
            args: () => { return {} as IGroup[] },
            address: "api/data/groups/",
            method: "POST",
            argsKeys: [],
        },
        createGroup: {
            args: (name: string, location: string, description: string) => { return {} as IGroup[] },
            address: "api/data/create-group/",
            method: "POST",
            argsKeys: ["name", "location", "description"],
        },
        editGroup: {
            args: (id: number, name: string, location: string, description: string) => { return },
            address: "api/data/edit-group/",
            method: "POST",
            argsKeys: ["id", "name", "location", "description"],
        },
        deleteGroup: {
            args: (id: number) => { return },
            address: "api/data/delete-group/",
            method: "POST",
            argsKeys: ["id"],
        },
    },
    tank: {
        getTanks: {
            args: (group_id: number) => { return {} as ITank[] },
            address: "api/data/tanks/",
            method: "POST",
            argsKeys: ["group_id"],
        },
        createTank: {
            args: (name: string, type: string, capacity: number, group_id: number) => { return },
            address: "api/data/create-tank/",
            method: "POST",
            argsKeys: ["name", "type", "capacity", "group_id"],
        },
        editTank: {
            args: (id: number, name: string, type: string, capacity: number, is_active: boolean, group_id: number) => { return },
            address: "api/data/edit-tank/",
            method: "POST",
            argsKeys: ["id", "name", "type", "capacity", "is_active", "group_id"],
        },
        deleteTank: {
            args: (id: number, group_id: number) => { return },
            address: "api/data/delete-tank/",
            method: "POST",
            argsKeys: ["id", "group_id"],
        },
    },
    sensor: {
        getSensor: {
            args: (tank_id: number, group_id: number) => { return {} as ISensor },
            address: "api/data/sensor/",
            method: "POST",
            argsKeys: ["tank_id", "group_id"],
        },
        createSensor: {
            args: (sensor_id: string, tank_id: number, group_id: number) => { return },
            address: "api/data/create-sensor/",
            method: "POST",
            argsKeys: ["sensor_id", "tank_id", "group_id",],
        },
        editSensor: {
            args: (id: number, sensor_id: string, is_active: boolean, tank_id: number, group_id: number,) => { return },
            address: "api/data/edit-sensor/",
            method: "POST",
            argsKeys: ["id", "sensor_id", "is_active", "tank_id", "group_id"],
        },
        deleteSensor: {
            args: (sensor_id: number, tank_id: number, group_id: number) => { return },
            address: "api/data/delete-sensor/",
            method: "POST",
            argsKeys: ["sensor_id", "tank_id", "group_id"],
        }
    },
    dashboard: {}
} as const;