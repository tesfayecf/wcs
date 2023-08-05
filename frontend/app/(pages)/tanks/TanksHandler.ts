import { store } from "@/app/utils/store/store";
import { ISensor, ITankCreationForm, ITanksParams } from "./TanksTypes";
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

        console.log("Dashboard handler getInstance()");
        return TanksHandler.instance;
    }

    // ACTIONS

    public async createTank() {
        store.dispatch(appActions.startLoading())
        // Check user is authorized
        const state = store.getState().tanks;
        // const { nameError, name, locationError, location, description } = state.tankGroupCreationForm;
        const {
            name, nameError,
            capacity, capacityError,
            type, typeError,
            dimensions, dimensionsError,
            material, materialError,
            brand, brandError,
        } = state.tankCreationForm;

        if (nameError || capacityError || typeError || dimensionsError || materialError || brandError) {
            throw new Error("Invalid form");
        } else {
            const response = await requestManager.request("dashboard", "createTank", [state.tankGroupId, name, capacity, type, dimensions, brand, material])
            if (response.status == 201) {
                console.log("Tank created");
            } else {
                store.dispatch(appActions.finishLoading())
                throw new Error(response.statusText);
            }
            this.setShowAddTankMenu(false);
            this.setTankCreationForm({
                name: "", nameError: false, capacity: 0, capacityError: false,
                brand: "", brandError: false, material: "", materialError: false,
                dimensions: "", dimensionsError: false, type: "", typeError: false,
            });

            // Update redux
            this.getTanksGroupInfo();
        }

        store.dispatch(appActions.finishLoading())
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
        // const nameError = /^[a-zA-Z0-9_]*$/.test(name);
        const nameError = false;
        store.dispatch(tankActions.setTankCreationForm({ name, nameError }))
    }

    public setTankCreationFormCapacity(capacity: number) {
        const capacityError = false;
        store.dispatch(tankActions.setTankCreationForm({ capacity, capacityError }));
    }

    public setTankCreationFormType(type: string) {
        const typeError = false;
        store.dispatch(tankActions.setTankCreationForm({ type, typeError }));
    }

    public setTankCreationFormDimension(dimensions: string) {
        const dimensionsError = false;
        store.dispatch(tankActions.setTankCreationForm({ dimensions, dimensionsError }));
    }

    public setTankCreationFormMaterial(material: string) {
        const materialError = false;
        store.dispatch(tankActions.setTankCreationForm({ material, materialError }));
    }

    public setTankCreationFormBrand(brand: string) {
        const brandError = false;
        store.dispatch(tankActions.setTankCreationForm({ brand, brandError }));
    }
}

export default TanksHandler;
