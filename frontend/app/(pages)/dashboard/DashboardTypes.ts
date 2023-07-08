
export interface ITankCreationForm {
    name: string;
    capacity: string;
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
//// ACTIONS
///////////////

export interface IDashboardActions {
    setShowAddTankMenu: (showAddTankMenu: boolean, set?: any, get?: any) => void;
    setTankCreationForm: (tankCreationForm: ITankCreationForm, set?: any, get?: any) => void
}

