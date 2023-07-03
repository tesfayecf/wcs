"use client"
import { useRef } from "react";
import { IAuthStore } from "./AuthTypes";
import { useStore } from "../store/store";

function AuthStoreInitializer(AuthStore: IAuthStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AuthStore: {
                ...state.AuthStore,
                store: AuthStore,
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default AuthStoreInitializer;

