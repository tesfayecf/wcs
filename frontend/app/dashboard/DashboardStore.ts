import { IStore } from "../store/storeTypes";
import { IDashboardStore, IDashboardEndpoints, ITankCreationForm } from "./DashboardTypes";
import { produce } from "immer";

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

export function getDashboardEndpoints(setLocal: any, getLocal: any): IDashboardEndpoints {
    
    return {
        setShowAddTankMenu: (showAddTankMenu: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.DashboardStore.store.showAddTankMenu = showAddTankMenu;
                return state;
            }));
        },

        setTankCreationForm: (tankCreationForm: ITankCreationForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.DashboardStore.store.tankCreationForm = tankCreationForm;
                return state;

            }))
        },
    }
}