"use client"
import { useRef } from "react";
import { IAppStore } from "./AppTypes";
import { useStore } from "../store/store";
import { AppEndpoints } from "./AppStore";


function AppStoreInitializer(AppStore: IAppStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AppStore: {
                store: AppStore,
                // endpoints: AppEndpoints
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default AppStoreInitializer;

