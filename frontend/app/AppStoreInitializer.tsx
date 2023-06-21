"use client"
import { useRef } from "react";
import { useStore, AppStore } from "./store/store";


function AppStoreInitializer(AppStore: AppStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AppStore: AppStore
        }))
        initialized.current = true;
    }
    return null;
}

export default AppStoreInitializer;

