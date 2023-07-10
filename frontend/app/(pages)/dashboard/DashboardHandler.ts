import { useStore } from "@/app/utils/store/store";
import { IDashboardStore, ITankCreationForm } from "./DashboardTypes";

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

    public init(): void {
        // Get initial dasboard data 
        console.log("Initialising dashboard...");
    }

    public getInitialStoreData: () => IDashboardStore = () => {
        return {
            showAddTankMenu: false,
            tankCreationForm: {
                name: '',
                type: 'Storage',
                capacity: "",
                dimension: '',
                material: '',
                brand: '',
            }
        }
    }

    public setInitialDashboardInfo() {
        useStore.setState((state) => ({
            DashboardStore: {
                ...state.DashboardStore,
                store: this.getInitialStoreData()
            }
        }));
        return useStore.getState().DashboardStore.store;
    }

    public setShowAddTankMenu(showAddTankMenu: boolean) {
        // check other things
        useStore.getState().DashboardStore.actions.setShowAddTankMenu(showAddTankMenu);

    }

    public setTankCreationForm(tankCreationForm: ITankCreationForm) {
        useStore.getState().DashboardStore.actions.setTankCreationForm(tankCreationForm);
    }
}

export default DashboardHandler;
