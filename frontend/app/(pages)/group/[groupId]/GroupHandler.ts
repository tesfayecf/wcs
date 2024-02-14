import { store } from "@/app/utils/store/store";
import { ISensor, ITank, ITankCreationForm, IGroupParams } from "@/app/(pages)/group/[groupId]/GroupTypes";
import { groupActions } from "@/app/(pages)/group/[groupId]/GroupReducer";
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
        await this.setGroupInfo();
        await this.getTanks();
        // await this.getSensors();
        // this.initializeWSConnections(); // dont wait

        store.dispatch(appActions.finishLoading())
    }

    public async loadParams(params: IGroupParams) {
        store.dispatch(groupActions.setParams({ params }));
    }

    public async setGroupInfo() {
        const groupId = store.getState().group.groupId;
        const groups = store.getState().dashboard.groups;
        const group = groups.find(group => group.id === groupId);
        if (group) {
            store.dispatch(groupActions.setGroupInfo({ groupInfo: group }));
        }
    }

    /// TANK HANDLER \\\
    public async getTanks() {
        try {
            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("tank", "getTanks", [groupId])
            if (response.isSuccess) {
                store.dispatch(groupActions.setTanks({ tanks: response.data }));
            } else {
                // TODO:  process response/handle errors
            }
        } catch (error) {
            // Log error
        }
    }

    public async createTank(fields: ITankCreationForm) {
        try {
            store.dispatch(appActions.startFormLoading())

            // Get fields
            const name = fields.name;
            const type = fields.type;
            const capacity = fields.capacity;
            const groupId = store.getState().group.groupId;

            const response = await requestManager.request("tank", "createTank", [name, type, capacity, groupId])

            // TODO:  process response/handle errors
            if (response.isSuccess) {
                this.getTanks();
            }
            this.setShowTankMenu(false);

            store.dispatch(appActions.finishFormLoading())
        } catch (error) {
            // Log error
        }
    }

    public async editTank(tankId: number, fields: ITankCreationForm) {
        try {
            store.dispatch(appActions.startFormLoading())

            // Get fields
            const name = fields.name;
            const type = fields.type;
            const capacity = fields.capacity;
            const is_active = true;
            const groupId = store.getState().group.groupId;

            const response = await requestManager.request("tank", "editTank", [tankId, name, type, capacity, is_active, groupId]);

            // TODO:  process response/handle errors
            if (response.isSuccess) {
                this.getTanks();
            }

            store.dispatch(appActions.finishFormLoading())
        } catch (error) {
            // Log error
        }
    }

    public async deleteTank(tankId: number) {
        try {
            store.dispatch(appActions.startFormLoading())

            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("tank", "deleteTank", [tankId, groupId])

            // TODO:  process response/handle errors
            if (response.isSuccess) {
                this.getTanks();
            }

            store.dispatch(appActions.finishFormLoading())
        } catch (error) {
            // Log error
        }
    }

    public setShowTankMenu(state: boolean) {
        store.dispatch(groupActions.setShowTankMenu({ state }))
    }

    /// SENSOR HANDLER \\\
    public async getSensors() {
        const tanks: ITank[] = store.getState().group.tanks;
        let sensors: ISensor[] = [];
        await Promise.all(tanks.map(async (tank: ITank) => {
            const sensor: ISensor | undefined = await this.getSensor(tank.id);
            if (sensor) sensors.push(sensor);
        }))
        store.dispatch(groupActions.setSensors({ sensors }));
    }

    public async getSensor(tankId: number) {
        try {
            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("sensor", "getSensor", [tankId, groupId]);
            if (response.isSuccess) {
                return response.data;
            }
        } catch (error) {
            // Log error
        }
    }

    public async createSensor(token: string) {
        try {
            store.dispatch(appActions.startFormLoading());

            // const tankId = store.getState().tank.tankId;
            const tankId = -1;
            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("sensor", "createSensor", [token, tankId, groupId]);
            if (response.isSuccess) {
                this.getSensors();
            }

            store.dispatch(appActions.finishFormLoading());
        } catch (error) {
            // Log error
        }
    }

    public async editSensor() {
        try {
            store.dispatch(appActions.startFormLoading());
            const sensorId = -1;
            const token = "";
            const is_active = true;
            const tankId = -1;
            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("sensor", "editSensor", [sensorId, token, is_active, tankId, groupId]);
            if (response.isSuccess) {
                this.getSensors();
            }

            store.dispatch(appActions.finishFormLoading());
        } catch (error) {
            // Log error
        }
    }

    public async deleteSensor() {
        try {
            store.dispatch(appActions.startFormLoading());

            const sensorId = -1;
            const tankId = -1;
            const groupId = store.getState().group.groupId;
            const response = await requestManager.request("sensor", "deleteSensor", [sensorId, tankId, groupId]);
            if (response.isSuccess) {
                this.getSensors();
            }

            store.dispatch(appActions.finishFormLoading());
        } catch (error) {
            // Log error
        }
    }

    /// WEBSOCKET HANDLER \\\
    // public async initializeWSConnections() {
    //     // const sensors = store.getState().tanks.sensors;
    //     // Promise.all(sensors.map(async (sensor) => {
    //     //     await websocketManager2.connect(sensor.id, this.handleWsConnection, this.handleWsMessage, this.handleWsError)
    //     // }))
    // }

    // public async closeWSConnections() {
    //     const sensors = store.getState().group.sensors;
    //     Promise.all(sensors.map(async (sensor) => {
    //         await websocketManager2.close(sensor.id)
    //     }))
    // }

    // private async handleWsConnection(event) {
    //     console.log("event", event);
    // }

    // private async handleWsMessage(message, sensorId) {
    //     const sensorsData = store.getState().group.sensorsData;
    //     let sensorsDataEdit = { ...sensorsData };
    //     sensorsDataEdit[sensorId] = message.water_level;
    //     store.dispatch(groupActions.setSensorsData({ sensorsData: sensorsDataEdit }));
    // }

    // private async handleWsError(message) {
    //     console.log("message", message);
    // }

    public unload() {
        // TODO: set debounced time out. If user enter the page again no need to reconnect.
        // this.closeWSConnections();
    }
}

export default GroupHandler;
