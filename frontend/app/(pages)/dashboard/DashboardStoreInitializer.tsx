"use client"
import { useRef } from "react";
import { useStore } from "@/app/utils/store/store"
import { IDashboardStore } from "./DashboardTypes"


function DashboardStoreInitializer(DashboardStore: IDashboardStore) {
    console.log("DashboardStoreInitializer")
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            DashboardStore: {
                ...state.DashboardStore,
                store: DashboardStore,
            }
        }), false, "DashboardStoreInitializer")
        initialized.current = true;
    }
    return null;
}

export default DashboardStoreInitializer;

