import { IGroup, IGroupStats } from "../dashboard/DashboardTypes";

export interface ITankCreationForm {
    name: string;
    nameError: boolean;
    capacity: number;
    capacityError: boolean;
    type: string;
    typeError: boolean;
    dimensions: string;
    dimensionsError: boolean;
    material: string;
    materialError: boolean;
    brand: string;
    brandError: boolean;
}

export interface ITankCreationForm {
    "Name": string;
    "Capacity": number;
    "Type": string;
    "Dimension": string;
    "Material": string;
    "Brand": string;
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
    dimensions: string;
    material: string;
    brand: string;
    isActive: boolean;
    hasSensor: boolean;
}

export interface IGroupParams {
    groupId: string;
}

export type ITankStatus = "Connected" | "Disconnected" | "Undefined"
export interface ISensor {
    id: string;
    serial_number: string;
    manufacturer: string;
    model: string;
    is_active: boolean;
    tank: {
        id: number;
        name: string;
    },
}