import { IStore } from "@/app/utils/store/storeTypes";
import { IDashboardStore, IDashboardActions, ITankCreationForm } from "./DashboardTypes";
import { produce } from "immer";

export const DashboardStoreDefault: IDashboardStore = {
    showAddTankMenu: false,
    tankCreationForm: {
        name: '',
        type: '',
        capacity: "",
        dimension: '',
        material: '',
        brand: '',
    }
}

export function getDashboardActions(setLocal: any, getLocal: any): IDashboardActions {

    return {
        setShowAddTankMenu: (showAddTankMenu: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.DashboardStore.store.showAddTankMenu = showAddTankMenu;
                return state;
            }), false, "setShowAddTankMenu");
        },

        setTankCreationForm: (tankCreationForm: ITankCreationForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.DashboardStore.store.tankCreationForm = tankCreationForm;
                return state;

            }), false, "setTankCreationForm");
        },
    }
}