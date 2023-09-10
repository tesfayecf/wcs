// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { ITankGroupCreationForm, ITankGroupCreationFormN } from "./DashboardTypes";
import { dashboardActions } from "./DashboardReducer";
import RequestManager from "@/app/utils/api/requestManager";
import { appActions } from "@/app/app/AppReducer";
import WebSocketManager from "@/app/utils/api/websocketManager";
import LogHandler from "@/app/app/LogHandler";

const requestManager = RequestManager.getInstance();
const logHandler = LogHandler.getInstance();
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

    /// DASHBOARD HANDLER \\\

    public async getSummaryData() {
        // const response = await requestManager.request("dashboard", "getSummary", [])
    }

    /// TANK GROUP HANDLER \\\

    public async getTankGroups() {
        const response = await requestManager.request("dashboard", "getTankGroups", [])
        if (response.isSuccess) {
            store.dispatch(dashboardActions.setTankGroups({ tankGroups: response.data }));
        } else {
            // TODO:  process response/handle errors
        }
    }

    public setShowCreateTankGroupMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowCreateTankGroupMenu({ state }))
    }

    public async createTankGroup(fields: ITankGroupCreationFormN) {
        store.dispatch(appActions.startFormLoading());

        // Get fields
        const name = fields["Name"];
        const location = fields["Location"];
        const description = fields["Description"];

        const response = await requestManager.request("dashboard", "createTankGroup", [name, location, description]);
        // TODO:  process response/handle errors

        // Update redux
        // store.dispatch(appActions.startLoading());
        this.getTankGroups();
        this.setShowCreateTankGroupMenu(false);

        store.dispatch(appActions.finishFormLoading());
    }
}

export default DashboardHandler;
