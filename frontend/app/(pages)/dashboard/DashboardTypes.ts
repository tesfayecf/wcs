
export interface ITankGroupCreationForm {
    name: string;
    nameError: boolean;
    location: string;
    locationError: boolean;
    description: string;
}

export interface IDashboardStore {
    tankGroups: ITankGroup[];
    showEditTankGroupMenu: boolean;
    showDeleteTankGroupMenu: boolean;
    selectedTankGroup: number;

    showAddTankGroupMenu: boolean;
    tankGroupCreationForm: ITankGroupCreationForm;
}

export interface ITankGroup {
    id: number;
    name: string;
    location: string;
}
