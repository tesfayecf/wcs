// import { useStore } from "@/app/utils/store/store";
import { store } from "@/app/utils/store/store";
import { IGroupCreationForm } from "@/app/(pages)/dashboard/DashboardTypes";
import { dashboardActions } from "@/app/(pages)/dashboard/DashboardReducer";
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
        // store.dispatch(appActions.startLoading());

        await Promise.all([
            this.getGroups(),
            this.getSummaryData(),
        ])

        store.dispatch(appActions.finishLoading())
    }

    public async unload() { }

    /// DASHBOARD HANDLER \\\
    public async getSummaryData() {
        // const response = await requestManager.request("dashboard", "getSummary", [])
    }

    public setShowGroupMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowCreateGroupMenu({ state }))
    }

    /// GROUP HANDLER \\\
    public async getGroups() {
        try {
            const response = await requestManager.request("dashboard", "getGroups", [])
            if (response.isSuccess) {
                store.dispatch(dashboardActions.setGroups({ groups: response.data }));
            } else {
                // TODO:  process response/handle errors
            }
        } catch (error) {
            // Log error
        }
    }

    public async createGroup(fields: IGroupCreationForm) {
        try {
            store.dispatch(appActions.startFormLoading());

            // Get fields
            const name = fields.name
            const location = fields.location
            const description = fields.description

            const response = await requestManager.request("dashboard", "createGroup", [name, location, description]);

            // TODO:  process response/handle errors
            if (response.isSuccess) {
                this.getGroups();
                this.setShowGroupMenu(false);
            }
            store.dispatch(appActions.finishFormLoading());
        } catch (error) {
            // Log error
        }
    }

    public async editGroup(groupId: number, fields: IGroupCreationForm) {
        try {
            store.dispatch(appActions.startFormLoading());

            // Get fields
            const name = fields.name
            const location = fields.location
            const description = fields.description

            const response = await requestManager.request("dashboard", "editGroup", [groupId, name, location, description]);
            if (response.isSuccess) {
                this.getGroups();
            }

            store.dispatch(appActions.finishFormLoading());
        }
        catch (error) {
            // Log error
        }
    }

    public async deleteGroup(groupId: number) {
        try {
            store.dispatch(appActions.startFormLoading());

            const response = await requestManager.request("dashboard", "deleteGroup", [groupId]);
            if (response.isSuccess) {
                this.getGroups();
            }

            store.dispatch(appActions.finishFormLoading());
        } catch (error) {
            // Log error
        }
    }
}

export default DashboardHandler;
