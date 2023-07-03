import { useStore } from "../store/store";
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
                capacity: 0,
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
        useStore.setState((state) => ({
            DashboardStore: {
                ...state.DashboardStore,
                store: {
                    ...state.DashboardStore.store,
                    showAddTankMenu: showAddTankMenu,
                }
            }
        }));
    }

    // TODO: import tank creation form type
    public setTankCreationForm(tankCreationForm: ITankCreationForm) {
        useStore.setState((state) => ({
            DashboardStore: {
                ...state.DashboardStore,
                store: {
                    ...state.DashboardStore.store,
                    tankCreationForm: tankCreationForm,
                }
            }
        }));
    }
}

export default DashboardHandler;
