import { IDashboardStore, IDashboardEndpoints } from "./DashboardTypes";



export const DashboardStoreDefault: IDashboardStore = {
    showAddTankMenu: false,
    tankCreationForm: {
        name: '',
        type: '',
        capacity: 0,
        dimension: '',
        material: '',
        brand: '',
    }
}

export const DashboardEndpoints: IDashboardEndpoints = {

};