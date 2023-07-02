"use client"
import { useRef } from "react";
import { AuthStore } from "./AuthTypes";
import { useStore } from "../store/store";


function AuthStoreInitializer(AuthStore: AuthStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AuthStore: AuthStore
        }))
        initialized.current = true;
    }
    return null;
}

export default AuthStoreInitializer;

