"use client";
import { useRef } from "react";
import { AppStore, useStore } from "@/app/store/store"

function AppStoreInitializer(AppStore: AppStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState({ AppStore });
        initialized.current = true;
    }
    return null;
}

export default AppStoreInitializer;