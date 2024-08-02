import { IGroup, IGroupStats } from "../../dashboard/types";

export interface IGroupParams {
    groupId: string;
}
export interface IGroupStore {
    groupId: number;
    group: IGroup;
    groupStats: IGroupStats;

    tankId: number;
    tanks: ITank[];
    showTankMenu: boolean;
}

export interface ITank {
    id: number;
    name: string;
    capacity: number;
    type: string;
    date_created: Date;
    date_modified: Date;
    is_active: boolean;
    sensor?: ISensor
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

export interface ISensorreading {
    time: Date;
    distance: number;
}