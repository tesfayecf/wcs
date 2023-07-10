"use client"
import { useRef } from "react";
import { IAppStore } from "./AppTypes";
import { useStore } from "../utils/store/store";

function AppStoreInitializer(AppStore: IAppStore) {
    console.log("AppStoreInitializer")
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AppStore: {
                ...state.AppStore,
                store: AppStore,
            }
        }), false, "AppStoreInitializer")
        initialized.current = true;
    }
    return null;
}

export default AppStoreInitializer;

