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
}

export interface ITanksParams {
    tankGroupId: string;
}

export interface ISensor {
    id: string;
    name: string;
    location: string;
    serial_number: string;
    manufacturer: string;
    model: string;
    is_active: boolean;
    tank: {
        id: number;
        name: string;
    },
}