import { ITankGroup, ITankGroupStats } from "../dashboard/DashboardTypes";

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
    tankGroupId: number;
    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
    tanks: ITank[];
    sensors: ISensor[];
    sensorsData: Record<string, any>;
    tankGroupInfo: ITankGroup;
    tankGroupStats: ITankGroupStats;
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
    tankGroupId: string;
}

export type ITankStatus = "ACTIVE" | "UNACTIVE" | "UNDEFINED"

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