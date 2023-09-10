import { store } from "@/app/utils/store/store";
import { ISensor, ITank, ITankCreationForm, ITankGroupCreationFormN, ITanksParams } from "./TanksTypes";
import { tankActions } from "./TanksReducer";
import RequestManager from "@/app/utils/api/requestManager";
import WebSocketManager2 from "@/app/utils/api/websocketManager2";
import { appActions } from "@/app/app/AppReducer";

const requestManager = RequestManager.getInstance();
const websocketManager2 = WebSocketManager2.getInstance();
class TanksHandler {
    private static instance: TanksHandler;
    private constructor() {
        console.log("Dashboard handler constructor");
    }

    public static getInstance(): TanksHandler {
        if (!TanksHandler.instance) {
            TanksHandler.instance = new TanksHandler();
        }
        return TanksHandler.instance;
    }

    /// LOADER \\\

    public async load(params: ITanksParams) {
        // store.dispatch(appActions.startLoading()); // BUG: infinit rerender

        await this.loadParams(params);
        await this.getTanksInfo();
        await this.getSensorsInfo();
        await this.initializeWSConnections();

        store.dispatch(appActions.finishLoading())
    }

    public async loadParams(params: ITanksParams) {
        store.dispatch(tankActions.setParams({ params }));
    }

    /// TANKS HANDLER \\\

    public async getTanksInfo() {
        const state = store.getState().tanks;
        const response = await requestManager.request("tanks", "getTanks", [state.tankGroupId])
        if (response.isSuccess) {
            store.dispatch(tankActions.setTanks({ tanks: response.data.tanks }));
            store.dispatch(tankActions.setTankGroupInfo({ tankGroupInfo: response.data.tankGroup }));
            store.dispatch(tankActions.setTankGroupStats({ tankGroupStats: response.data.tankGroupStats }));
        } else {
            // TODO:  process response/handle errors
        }
    }

    public async createTank(fields: ITankGroupCreationFormN) {
        store.dispatch(appActions.startFormLoading())

        // Get fields
        const name = fields["Name"];
        const capacity = fields["Capacity"];
        const type = fields["Type"];
        const dimensions = fields["Dimension"];
        const brand = fields["Brand"];
        const material = fields["Material"];

        const state = store.getState().tanks;
        const response = await requestManager.request("tanks", "createTank", [state.tankGroupId, name, capacity, type, dimensions, brand, material])
        // TODO:  process response/handle errors

        // Update redux
        this.getTanksInfo();
        this.setShowAddTankMenu(false);

        store.dispatch(appActions.finishFormLoading())
    }

    public setShowAddTankMenu(state: boolean) {
        store.dispatch(tankActions.setShowAddTankMenu({ state }))
    }

    /// SENSOR HANDLER \\\

    public async getSensorsInfo() {
        const tanks: ITank[] = store.getState().tanks.tanks;
        let sensors: ISensor[] = [];
        await Promise.all(tanks.map(async (tank: ITank) => {
            if (tank.hasSensor) {
                const sensor: ISensor | undefined = await this.getSensor(tank.id);
                if (sensor) sensors.push(sensor);
            }
        }))
        store.dispatch(tankActions.setSensors({ sensors }));
    }

    public async getSensor(tankId: number) {
        const state = store.getState().tanks;
        const response = await requestManager.request("tanks", "getSensor", [tankId, state.tankGroupId]);
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
        const sensors = store.getState().tanks.sensors;
        Promise.all(sensors.map(async (sensor) => {
            await websocketManager2.close(sensor.id)
        }))
    }

    private async handleWsConnection(event) {
        console.log("event", event);
    }

    private async handleWsMessage(message, sensorId) {
        const sensorsData = store.getState().tanks.sensorsData;
        let sensorsDataEdit = { ...sensorsData };
        sensorsDataEdit[sensorId] = message.water_level;
        store.dispatch(tankActions.setSensorsData({ sensorsData: sensorsDataEdit }));
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
        const state = store.getState().tanks;
        const response = await requestManager.request("tanks", "getTank", [tankId, state.tankGroupId])
        if (response.isSuccess) {
        } else {
            // TODO: process response/handle errors
        }
    }
}

export default TanksHandler;
