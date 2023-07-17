// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { IDashboardStore, ITankCreationForm } from "./DashboardTypes";
import { dashboardActions } from "./DashboardReducer";

class DashboardHandler {
    private static instance: DashboardHandler;
    private constructor() {
        console.log("Dashboard handler constructor");
    }

    public static getInstance(): DashboardHandler {
        if (!DashboardHandler.instance) {
            DashboardHandler.instance = new DashboardHandler();
        }

        console.log("Dashboard handler getInstance()");
        return DashboardHandler.instance;
    }

    public setShowAddTankMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowAddTankMenu({ state }))
    }

    public setTankCreationForm(form: ITankCreationForm) {
        store.dispatch(dashboardActions.setTankCreationForm({ form }))
    }

    public setTankCreationFormName(name: string) {
        const error = /^[a-zA-Z0-9_]*$/.test(name);
        store.dispatch(dashboardActions.setTankCreationFormName({ name, error }))
    }

    public setTankCreationFormCapacity(capacity: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormCapacity({ capacity, error }));
    }

    public setTankCreationFormType(type: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormType({ type, error }));
    }

    public setTankCreationFormDimension(dimension: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormDimension({ dimension, error }));
    }

    public setTankCreationFormMaterial(material: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormMaterial({ material, error }));
    }

    public setTankCreationFormBrand(brand: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormBrand({ brand, error }));
    }


    // public setInitialDashboardInfo() {
    //     useStore.setState((state) => ({
    //         DashboardStore: {
    //             ...state.DashboardStore,
    //             store: this.getInitialStoreData()
    //         }
    //     }));
    //     return useStore.getState().DashboardStore.store;
    // }

    // public setShowAddTankMenu(showAddTankMenu: boolean) {
    //     // check other things
    //     useStore.getState().DashboardStore.actions.setShowAddTankMenu(showAddTankMenu);

    // }

    // public setTankCreationForm(tankCreationForm: ITankCreationForm) {
    //     useStore.getState().DashboardStore.actions.setTankCreationForm(tankCreationForm);
    // }
}

export default DashboardHandler;
