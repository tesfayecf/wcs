import { ITankGroup } from "../dashboard/DashboardTypes";

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
}

export interface ITank {
    id: string;
    name: string;
    capacity: number;
    type: string;
    dimension: string;
    material: string;
    brand: string;
}

export interface ITanksParams {
    tankGroupId: string;
}