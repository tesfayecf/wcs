'use client'
import React from "react";
import { useRouter } from 'next/navigation';
import { useStore } from "../utils/store/store";
import AppHandler from '../app/AppHandler';
import { Redirect } from "../utils/redirect/redirect";

const appHandler = AppHandler.getInstance();

export const metadata = {
    title: 'WCS App',
    description: 'Web app to control water resources',
}

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    const router = useRouter();

    const state = useStore(state => state.AppStore.store);
    console.log("RequireAuth ", state.isAuthenticated)

    // React.useEffect(() => {
    //     appHandler.startAuthentication();
    //     const authenticateUser = async () => {
    //         const isAuthenticated = await appHandler.authenticateUser();
    //         // setIsAuthenticated(isAuthenticated);
    //         if (isAuthenticated) {
    //             router.replace("./dashboard");
    //             router.refresh();
    //         }
    //     }
    //     authenticateUser();
    //     appHandler.finishAuthentication();
    // }, [])

    return (
        <div id="authLayout">
            {children}
        </div>
    )
}
