

export interface ITankCreationForm {
    name: string;
    capacity: number;
    type: string;
    dimension: string;
    material: string;
    brand: string;
}

export interface DashboardStore {
    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
}