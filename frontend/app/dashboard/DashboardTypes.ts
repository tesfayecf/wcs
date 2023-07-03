
export interface ITankCreationForm {
    name: string;
    capacity: number;
    type: string;
    dimension: string;
    material: string;
    brand: string;
}

export interface IDashboardStore {
    showAddTankMenu: boolean;
    tankCreationForm: ITankCreationForm;
}


///////////////
//// ENDPOINTS
///////////////

export interface IDashboardEndpoints {
    prova: () => void
}

