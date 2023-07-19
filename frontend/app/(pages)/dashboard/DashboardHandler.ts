// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { ITankGroupCreationForm } from "./DashboardTypes";
import { dashboardActions } from "./DashboardReducer";
import RequestManager from "@/app/utils/api/requestManager";
import { appActions } from "@/app/app/AppReducer";

const requestManager = RequestManager.getInstance();

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

    public async load() {
        // check use data
        await this.getTankGroups();
    }


    public async unload() { }

    public async getTankGroups() {
        const response = await requestManager.request("dashboard", "getTankGroups", [])
        if (response.status == 200) {
            store.dispatch(dashboardActions.setTankGroups({ tankGroups: response.data }));
        } else {
            throw new Error(response.statusText);
        }
    }

    public async createTankGroup() {
        store.dispatch(appActions.startLoading())
        // Check user is authorized
        const state = store.getState().dashboard;
        const { nameError, name, locationError, location } = state.tankGroupCreationForm;
        if (nameError || locationError || name === "" || location === "" || !name || !location) {
            throw new Error("Invalid form");
        } else {
            const response = await requestManager.request("dashboard", "createTankGroup", [name, location])
            if (response.status == 201) {
                console.log("Tank group created");
            } else {
                throw new Error(response.statusText);
            }
            this.setShowCreateTankGroupMenu(false);
            this.setTankGroupCreationForm({ name: "", location: "", nameError: false, locationError: false });

            // Update redux
            this.getTankGroups();
        }
        store.dispatch(appActions.finishLoading())
    }

    public setShowCreateTankGroupMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowCreateTankGroupMenu({ state }))
    }

    public setTankGroupCreationForm(form: ITankGroupCreationForm) {
        store.dispatch(dashboardActions.setTankGroupCreationForm({ form }))
    }

    public setTankGroupCreationFormName(name: string) {
        const error = !/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/.test(name);
        store.dispatch(dashboardActions.setTankCreationFormName({ name, error: error }))
    }

    public setTankGroupCreationFormLocation(location: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormLocation({ location, error: error }));
    }
}

export default DashboardHandler;
