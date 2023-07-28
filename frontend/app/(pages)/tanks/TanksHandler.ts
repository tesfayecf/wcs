import { store } from "@/app/utils/store/store";
import { ISensor, ITankCreationForm, ITanksParams } from "./TanksTypes";
import { tankActions } from "./TanksReducer";
import RequestManager from "@/app/utils/api/requestManager";
import WebSocketManager2 from "@/app/utils/api/websocketManager2";

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

        console.log("Dashboard handler getInstance()");
        return TanksHandler.instance;
    }

    // LOADERS

    public async load(params: ITanksParams) {
        await this.loadParams(params);
        await this.loadTanks();
        await this.loadSensors();
        await this.initializeWSConnections();
    }
    public async loadParams(params: ITanksParams) {
        store.dispatch(tankActions.setParams({ params }));
    }

    public async loadTanks() {
        await this.getTanksGroupInfo()
    }

    public async loadSensors() {
        const tanks = store.getState().tanks.tanks;
        let sensors: ISensor[] = []
        await Promise.all(tanks.map(async (tank) => {
            const sensor = await this.getTankSensor(tank.id)
            console.log(sensor)
            if (Object.keys(sensor).length !== 0)
                sensors.push(sensor)
        }))
        console.log(sensors)
        store.dispatch(tankActions.setSensors({ sensors }));
    }

    public async initializeWSConnections() {
        const sensors = store.getState().tanks.sensors;
        Promise.all(sensors.map(async (sensor) => {
            await websocketManager2.connect(sensor.id, this.handleWsConnection, this.handleWsMessage, this.handleWsError)
        }))
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
        // store.dispatch(tankActions.unload());
    }

    // GETTER

    public async getTanksGroupInfo() {
        const state = store.getState().tanks;
        const response = await requestManager.request("dashboard", "getTankGroupTanks", [state.tankGroupId])
        if (response.status == 200) {
            store.dispatch(tankActions.setTanks({ tanks: response.data.tanks }));
            store.dispatch(tankActions.setTankGroupInfo({ tankGroupInfo: response.data.tankGroup }));
            store.dispatch(tankActions.setTankGroupStats({ tankGroupStats: response.data.tankGroupStats }));
        } else {
            throw new Error(response.statusText);
        }
    }

    public async getTankInfo(tankId: number) {
        const state = store.getState().tanks;
        const response = await requestManager.request("dashboard", "getTank", [tankId, state.tankGroupId])
        if (response.status == 200) {
        } else {
            throw new Error(response.statusText);
        }
    }

    public async getTankSensor(tankId: number) {
        const state = store.getState().tanks;
        const response = await requestManager.request("dashboard", "getTankSensor", [tankId, state.tankGroupId]);
        if (response.status == 200) {
            return response.data;
        } else {
            throw new Error(response.statusText);
        }
    }


    // SETTERS

    public setShowAddTankMenu(state: boolean) {
        store.dispatch(tankActions.setShowAddTankMenu({ state }))
    }

    public setTankCreationForm(form: ITankCreationForm) {
        store.dispatch(tankActions.setTankCreationForm({ form }))
    }

    public setTankCreationFormName(name: string) {
        const error = /^[a-zA-Z0-9_]*$/.test(name);
        store.dispatch(tankActions.setTankCreationFormName({ name, error }))
    }

    public setTankCreationFormCapacity(capacity: string) {
        const error = false;
        store.dispatch(tankActions.setTankCreationFormCapacity({ capacity, error }));
    }

    public setTankCreationFormType(type: string) {
        const error = false;
        store.dispatch(tankActions.setTankCreationFormType({ type, error }));
    }

    public setTankCreationFormDimension(dimension: string) {
        const error = false;
        store.dispatch(tankActions.setTankCreationFormDimension({ dimension, error }));
    }

    public setTankCreationFormMaterial(material: string) {
        const error = false;
        store.dispatch(tankActions.setTankCreationFormMaterial({ material, error }));
    }

    public setTankCreationFormBrand(brand: string) {
        const error = false;
        store.dispatch(tankActions.setTankCreationFormBrand({ brand, error }));
    }
}

export default TanksHandler;
