import { store } from "@/app/utils/store/store";
import { ISensor, ITank, ITankCreationForm, IGroupParams } from "@/app/(pages)/group/GroupTypes";
import { groupActions } from "@/app/(pages)/group/GroupReducer";
import RequestManager from "@/app/utils/api/requestManager";
import WebSocketManager2 from "@/app/utils/api/websocketManager2";
import { appActions } from "@/app/app/AppReducer";

const requestManager = RequestManager.getInstance();
const websocketManager2 = WebSocketManager2.getInstance();

class GroupHandler {
    private static instance: GroupHandler;
    private constructor() {
        console.log("Group handler constructor");
    }

    public static getInstance(): GroupHandler {
        if (!GroupHandler.instance) {
            GroupHandler.instance = new GroupHandler();
        }
        return GroupHandler.instance;
    }

    /// LOADER \\\

    public async load(params: IGroupParams) {
        // store.dispatch(appActions.startLoading()); // BUG: infinit rerender

        await this.loadParams(params);
        await this.getTanksInfo();
        await this.getSensorsInfo();
        this.initializeWSConnections(); // dont wait

        store.dispatch(appActions.finishLoading())
    }

    public async loadParams(params: IGroupParams) {
        store.dispatch(groupActions.setParams({ params }));
    }

    /// GROUP HANDLER \\\

    public async getTanksInfo() {
        const state = store.getState().group;
        const response = await requestManager.request("tanks", "getTanks", [state.groupId])
        if (response.isSuccess) {
            store.dispatch(groupActions.setTanks({ tanks: response.data.tanks }));
            store.dispatch(groupActions.setGroupInfo({ groupInfo: response.data.group }));
            store.dispatch(groupActions.setGroupStats({ groupStats: response.data.groupStats }));
        } else {
            // TODO:  process response/handle errors
        }
    }

    public async createTank(fields: ITankCreationForm) {
        store.dispatch(appActions.startFormLoading())

        // Get fields
        const name = fields["Name"];
        const capacity = fields["Capacity"];
        const type = fields["Type"];
        const dimensions = fields["Dimension"];
        const brand = fields["Brand"];
        const material = fields["Material"];

        const state = store.getState().group;
        const response = await requestManager.request("tanks", "createTank", [state.groupId, name, capacity, type, dimensions, brand, material])
        // TODO:  process response/handle errors

        // Update redux
        this.getTanksInfo();
        this.setShowTankMenu(false);

        store.dispatch(appActions.finishFormLoading())
    }

    public setShowTankMenu(state: boolean) {
        store.dispatch(groupActions.setShowTankMenu({ state }))
    }

    /// SENSOR HANDLER \\\

    public async getSensorsInfo() {
        const tanks: ITank[] = store.getState().group.tanks;
        let sensors: ISensor[] = [];
        await Promise.all(tanks.map(async (tank: ITank) => {
            if (tank.hasSensor) {
                const sensor: ISensor | undefined = await this.getSensor(tank.id);
                if (sensor) sensors.push(sensor);
            }
        }))
        store.dispatch(groupActions.setSensors({ sensors }));
    }

    public async getSensor(tankId: number) {
        const state = store.getState().group;
        const response = await requestManager.request("tanks", "getSensor", [tankId, state.groupId]);
        if (response.isSuccess) {
            return response.data;
        }
    }

    public async initializeWSConnections() {
        // const sensors = store.getState().tanks.sensors;
        // Promise.all(sensors.map(async (sensor) => {
        //     await websocketManager2.connect(sensor.id, this.handleWsConnection, this.handleWsMessage, this.handleWsError)
        // }))
    }

    public async closeWSConnections() {
        const sensors = store.getState().group.sensors;
        Promise.all(sensors.map(async (sensor) => {
            await websocketManager2.close(sensor.id)
        }))
    }

    private async handleWsConnection(event) {
        console.log("event", event);
    }

    private async handleWsMessage(message, sensorId) {
        const sensorsData = store.getState().group.sensorsData;
        let sensorsDataEdit = { ...sensorsData };
        sensorsDataEdit[sensorId] = message.water_level;
        store.dispatch(groupActions.setSensorsData({ sensorsData: sensorsDataEdit }));
    }

    private async handleWsError(message) {
        console.log("message", message);
    }

    public unload() {
        // TODO: set debounced time out. If user enter the page again no need to reconnect.
        this.closeWSConnections();
    }

    /// TANK HANDLER \\\

    public async getTankInfo(tankId: number) {
        const state = store.getState().group;
        const response = await requestManager.request("tanks", "getTank", [tankId, state.groupId])
        if (response.isSuccess) {
        } else {
            // TODO: process response/handle errors
        }
    }
}

export default GroupHandler;
