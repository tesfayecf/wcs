import { IGroup, ITankGroupStats } from "../dashboard/DashboardTypes";

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

export interface ITankGroupCreationFormN {
    "Name": string;
    "Capacity": number;
    "Type": string;
    "Dimension": string;
    "Material": string;
    "Brand": string;
}

export interface ITanksStore {
    tankId: number;
    tanks: ITank[];

    sensors: ISensor[];
    sensorsData: Record<string, any>;

    groupId: number;
    groupInfo: IGroup;
    groupStats: ITankGroupStats;

    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
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

export interface ITanksParams {
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