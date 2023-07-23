import { store } from "@/app/utils/store/store";
import { ITankCreationForm } from "./TanksTypes";
import { dashboardActions } from "./TanksReducer";

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

    public load() {

    }

    public unload() {

    }

    public setShowAddTankMenu(state: boolean) {
        store.dispatch(dashboardActions.setShowAddTankMenu({ state }))
    }

    public setTankCreationForm(form: ITankCreationForm) {
        store.dispatch(dashboardActions.setTankCreationForm({ form }))
    }

    public setTankCreationFormName(name: string) {
        const error = /^[a-zA-Z0-9_]*$/.test(name);
        store.dispatch(dashboardActions.setTankCreationFormName({ name, error }))
    }

    public setTankCreationFormCapacity(capacity: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormCapacity({ capacity, error }));
    }

    public setTankCreationFormType(type: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormType({ type, error }));
    }

    public setTankCreationFormDimension(dimension: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormDimension({ dimension, error }));
    }

    public setTankCreationFormMaterial(material: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormMaterial({ material, error }));
    }

    public setTankCreationFormBrand(brand: string) {
        const error = false;
        store.dispatch(dashboardActions.setTankCreationFormBrand({ brand, error }));
    }
}

export default TanksHandler;
