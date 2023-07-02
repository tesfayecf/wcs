"use client"
import { useRef } from "react";
import { useStore } from "@/app/store/store"
import { IDashboardStore } from "./DashboardTypes"
import { DashboardEndpoints } from "./DashboardStore";


function DashboardStoreInitializer(DashboardStore: IDashboardStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            DashboardStore: {
                store: DashboardStore,
                endpoints: DashboardEndpoints
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default DashboardStoreInitializer;

