"use client";
import { useRef } from "react";
import { DashboardStore, useStore } from "@/app/store/store"

function DashboardStoreInitializer(DashboardStore: DashboardStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState({ DashboardStore });
        initialized.current = true;
    }
    return null;
}

export default DashboardStoreInitializer;