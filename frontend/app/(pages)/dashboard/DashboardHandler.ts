// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { IGroupCreationForm } from "./DashboardTypes";
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
        await this.getGroups();
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

    public async getGroups() {
        const response = await requestManager.request("dashboard", "getGroups", [])
        if (response.isSuccess) {
            store.dispatch(dashboardActions.setGroups({ groups: response.data }));
        } else {
            // TODO:  process response/handle errors
        }
    }

    public setShowGroupMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowGroupMenu({ state }))
    }

    public async createGroup(fields: IGroupCreationForm) {
        store.dispatch(appActions.startFormLoading());

        // Get fields
        const name = fields["Name"];
        const location = fields["Location"];
        const description = fields["Description"];

        const response = await requestManager.request("dashboard", "createGroup", [name, location, description]);
        // TODO:  process response/handle errors

        // Update redux
        // store.dispatch(appActions.startLoading());
        this.getGroups();
        this.setShowGroupMenu(false);

        store.dispatch(appActions.finishFormLoading());
    }
}

export default DashboardHandler;
