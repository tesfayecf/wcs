import { IGroup, IGroupStats } from "../../dashboard/types";

export interface IGroupParams {
    groupId: string;
}
export interface IGroupStore {
    tankId: number;
    tanks: ITank[];

    sensors: ISensor[];
    sensorsData: Record<string, any>;

    groupId: number;
    groupInfo: IGroup;
    groupStats: IGroupStats;

    showTankMenu: boolean;
}

export interface ITank {
    id: number;
    name: string;
    capacity: number;
    type: string;
    date_created: Date;
    date_modified: Date;
    is_Active: boolean;
}

export interface ITankCreationForm {
    name: string;
    type: string;
    capacity: number;
    is_active: boolean;
}

export type ITankStatus = "Connected" | "Disconnected" | "Undefined"

export interface ISensor {
    id: string;
    sensor_id: string;
    is_active: boolean;
    tank_id: number;
}

export interface ISensorCreationForm {
    sensorId: string;
}