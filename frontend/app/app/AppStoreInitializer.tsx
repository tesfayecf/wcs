"use client"
import { useRef } from "react";
import { IAppStore } from "./AppTypes";
import { useStore } from "../store/store";

function AppStoreInitializer(AppStore: IAppStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AppStore: {
                ...state.AppStore,
                store: AppStore,
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default AppStoreInitializer;

