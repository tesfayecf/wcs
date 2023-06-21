import { useStore } from "../store/store";

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

    public setInitialDashboardInfo() {
        useStore.setState((state) => ({
            DashboardStore: {
                showAddTankMenu: false,
            }
        }));
        return useStore.getState().DashboardStore;
    }

    public setShowAddTankMenu(showAddTankMenu: boolean) {
        useStore.setState((state) => ({
            DashboardStore: {
                showAddTankMenu: showAddTankMenu,
            }
        }));
    }
}

export default DashboardHandler;