"use client"
import { useRef } from "react";
import { IAuthStore } from "./AuthTypes";
import { useStore } from "../store/store";
import { AuthEndpoints } from "./AuthStore";


function AuthStoreInitializer(AuthStore: IAuthStore) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useStore.setState((state) => ({
            AuthStore: {
                store: AuthStore,
                endpoints: AuthEndpoints
            }
        }))
        initialized.current = true;
    }
    return null;
}

export default AuthStoreInitializer;

