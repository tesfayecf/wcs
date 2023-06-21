"use client"
import { useRef } from "react";
import { useStore, DashboardStore } from "@/app/store/store"


function DashboardStoreInitializer(DashboardStore: DashboardStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            DashboardStore: DashboardStore
        }))
        initialized.current = true;
    }
    return null;
}

export default DashboardStoreInitializer;

