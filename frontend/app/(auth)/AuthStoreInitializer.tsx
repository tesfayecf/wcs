"use client"
import { useRef } from "react";
import { IAuthStore } from "./AuthTypes";
import { useStore } from "../utils/store/store";

function AuthStoreInitializer(AuthStore: IAuthStore) {
    console.log("AuthStoreInitializer")
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AuthStore: {
                ...state.AuthStore,
                store: AuthStore,
            }
        }), false, "AuthStoreInitializer")
        initialized.current = true;
    }
    return null;
}

export default AuthStoreInitializer;

