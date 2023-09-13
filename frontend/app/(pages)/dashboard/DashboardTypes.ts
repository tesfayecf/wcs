

export interface IDashboardStore {
    tankGroups: IGroup[];
    showEditTankGroupMenu: boolean;
    showDeleteTankGroupMenu: boolean;
    selectedTankGroup: number;
    summary: any;
    showAddTankGroupMenu: boolean;
    tankGroupCreationForm: ITankGroupCreationForm;
}

export interface IGroup {
    id: number;
    name: string;
    location: string;
    description: string;
}

export interface ITankGroupStats {
    totalTanks: number,
    averageWaterLevel: number,
    minWaterLevel: number,
    maxWaterLevel: number,
    totalCapacity: number,
}

export interface ITankGroupCreationForm {
    name: string;
    nameError: boolean;
    location: string;
    locationError: boolean;
    description: string;
    descriptionError: boolean;
}

export interface ITankGroupCreationFormN {
    "Name": string;
    "Location": string;
    "Description": string;
}