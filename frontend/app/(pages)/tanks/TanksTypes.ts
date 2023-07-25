import { ITankGroup, ITankGroupStats } from "../dashboard/DashboardTypes";

export interface ITankCreationForm {
    name: string;
    nameError: boolean;
    capacity: string;
    capacityError: boolean;
    type: string;
    typeError: boolean;
    dimension: string;
    dimensionError: boolean;
    material: string;
    materialError: boolean;
    brand: string;
    brandError: boolean;
}

export interface ITanksStore {
    tankGroupId: number;
    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
    tanks: ITank[];
    tankGroupInfo: ITankGroup;
    tankGroupStats: ITankGroupStats;
}

export interface ITank {
    id: string;
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