// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { ITankGroupCreationForm } from "./DashboardTypes";
import { dashboardActions } from "./DashboardReducer";
import RequestManager from "@/app/utils/api/requestManager";
import { appActions } from "@/app/app/AppReducer";
import WebSocketManager from "@/app/utils/api/websocketManager";

const requestManager = RequestManager.getInstance();
const webSocketManager = WebSocketManager.getInstance();

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
        await this.getTankGroups();
        await this.getSummaryData();
        // await this.startWS();
        const message = {
            message: "test",
            sender: "test"
        }
        // await webSocketManager.sendWebSocketData("prova", message)
        // await webSocketManager.receiveWebSocketData("prova");

        store.dispatch(appActions.finishLoading())
    }


    public async unload() { }

    public async startWS() {
        await webSocketManager.initWS("prova");
    }

    /// TANK GROUP HANDLER \\\

    public async getSummaryData() {
        // const response = await requestManager.request("dashboard", "getSummary", [])
        const response = {
            statusText: "OK",
            status: 200,
            data: {

            }
        }
        if (response.status == 200) {
            store.dispatch(dashboardActions.setSummary({ summary: response.data }));
        } else {
            throw new Error(response.statusText);
        }
    }

    /// TANK GROUP HANDLER \\\

    public async getTankGroups() {
        const response = await requestManager.request("dashboard", "getTankGroups", [])
        if (response.status == 200) {
            store.dispatch(dashboardActions.setTankGroups({ tankGroups: response.data }));
        } else {
            throw new Error(response.statusText);
        }
    }

    public setShowCreateTankGroupMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowCreateTankGroupMenu({ state }))
    }

    public setTankGroupCreationForm(form: ITankGroupCreationForm) {
        store.dispatch(dashboardActions.setTankGroupCreationForm({ form }))
    }

    public async createTankGroup() {
        store.dispatch(appActions.startLoading())
        // Check user is authorized
        const state = store.getState().dashboard;
        const { nameError, name, locationError, location, description } = state.tankGroupCreationForm;
        if (nameError || locationError || name === "" || location === "" || !name || !location) {
            throw new Error("Invalid form");
        } else {
            const response = await requestManager.request("dashboard", "createTankGroup", [name, location, description])
            if (response.status == 201) {
                console.log("Tank group created");
            } else {
                throw new Error(response.statusText);
            }
            this.setShowCreateTankGroupMenu(false);
            this.setTankGroupCreationForm({ name: "", location: "", nameError: false, locationError: false, description: "", descriptionError: false });

            // Update redux
            this.getTankGroups();
        }
        store.dispatch(appActions.finishLoading())
    }

    public setTankGroupCreationFormName(name: string) {
        const nameError = !/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/.test(name);
        store.dispatch(dashboardActions.setTankGroupCreationForm({ name, nameError }))
    }

    public setTankGroupCreationFormLocation(location: string) {
        const locationError = false;
        store.dispatch(dashboardActions.setTankGroupCreationForm({ location, locationError }));
    }

    public setTankGroupCreationFormDescription(description: string) {
        const descriptionError = false;
        store.dispatch(dashboardActions.setTankGroupCreationForm({ description, descriptionError }));
    }
}

export default DashboardHandler;
