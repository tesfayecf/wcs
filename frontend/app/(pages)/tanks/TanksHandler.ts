import { store } from "@/app/utils/store/store";
import { ITankCreationForm, ITanksParams } from "./TanksTypes";
import { tankActions } from "./TanksReducer";
import RequestManager from "@/app/utils/api/requestManager";

const requestManager = RequestManager.getInstance();

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

    public async loadParams(params: ITanksParams) {
        store.dispatch(tankActions.setParams({ params }));
    }


    public async load() {
        await this.getTanks()
    }

    public unload() {

    }

    public async getTanks() {
        const state = store.getState().tanks;
        console.log(state.tankGroupId)
        const response = await requestManager.request("dashboard", "getTankGroupTanks", [state.tankGroupId])
        if (response.status == 200) {
            store.dispatch(tankActions.setTanks({ tanks: response.data.tanks }));
            store.dispatch(tankActions.setTankGroupInfo({ tankGroupInfo: response.data.tankGroup }));
        } else {
            throw new Error(response.statusText);
        }
    }

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
