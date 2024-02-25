// import { useStore } from "@/app/lib/store/store";
import { store } from "@/app/lib/store/store";
import { IGroupCreationForm } from "@/app/(main)/dashboard/DashboardTypes";
import { dashboardActions } from "@/app/(main)/dashboard/DashboardReducer";
import RequestManager from "@/app/lib/api/requestManager";

const requestManager = RequestManager.getInstance();
class DashboardHandler {
    private static instance: DashboardHandler;
    private constructor() { }

    public static getInstance(): DashboardHandler {
        if (!DashboardHandler.instance) {
            DashboardHandler.instance = new DashboardHandler();
        }
        return DashboardHandler.instance;
    }

    public async load() {
        await Promise.all([
            this.getGroups(),
            this.getSummaryData(),
        ])
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
            const response = await requestManager.request("group", "getGroups", []);
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
            // Get fields
            const name = fields.name
            const location = fields.location
            const description = fields.description

            const response = await requestManager.request("group", "createGroup", [name, location, description]);

            // TODO:  process response/handle errors
            if (response.isSuccess) {
                this.getGroups();
                this.setShowGroupMenu(false);
            }
        } catch (error) {
            // Log error
        }
    }

    public async editGroup(groupId: number, fields: IGroupCreationForm) {
        try {
            // Get fields
            const name = fields.name
            const location = fields.location
            const description = fields.description

            const response = await requestManager.request("group", "editGroup", [groupId, name, location, description]);
            if (response.isSuccess) {
                this.getGroups();
            }
        }
        catch (error) {
            // Log error
        }
    }

    public async deleteGroup(groupId: number) {
        try {
            const response = await requestManager.request("group", "deleteGroup", [groupId]);
            if (response.isSuccess) {
                this.getGroups();
            }
        } catch (error) {
            // Log error
        }
    }
}

export default DashboardHandler;
