"use client"
import { useRef } from "react";
import { useStore } from "@/app/store/store"
import { IDashboardStore } from "./DashboardTypes"
// import { DashboardEndpoints } from "./DashboardStore";


function DashboardStoreInitializer(DashboardStore: IDashboardStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            DashboardStore: {
                ...state.DashboardStore,
                store: DashboardStore,
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default DashboardStoreInitializer;

