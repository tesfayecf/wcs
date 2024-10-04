import { IGroup, IGroupStats } from "../../dashboard/types";

/// GROUP PARAMS ///
export interface IGroupParams {
    groupId: string;
}

/// GROUP STORE ///
export interface IGroupStore {
    groupId: number;
    group: IGroup;
    groupStats: IGroupStats;
    tankId: number;
    tanks: ITank[];
    showTankMenu: boolean;
}

/// TANK ///
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

/// SENSOR ///
export interface ISensor {
    id: string;
    sensor_id: string;
    is_active: boolean;
    tank_id: number;
}

export interface ISensorCreationForm {
    sensorId: string;
}

export interface ISensorReading {
    time: Date;
    distance: number;
}