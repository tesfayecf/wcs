
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

