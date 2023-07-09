'use client'
import React from "react";
import { redirect } from 'next/navigation';
import { useStore } from "../store/store";
import AppHandler from '../app/AppHandler';

const appHandler = AppHandler.getInstance();

export const metadata = {
    title: 'WCS App',
    description: 'Web app to control water resources',
}

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Auth layout")

    const { store, actions } = useStore.getState().AppStore;
    const { isAuthenticated } = store;

    React.useEffect(() => {

        const authenticateUser = async () => {
            try {
                // Simulated asynchronous authentication process
                // appHandler.authenticateUser(); // Assuming authenticateUser is a method in your authentication service

                // Authentication success
                // actions.finishAuthentication(); // Set isAuthenticated to true
                // actions.finishAuthentication();
                // window.location.replace("/dashboard")

            } catch (error) {
                // Authentication error
                console.error('Authentication error:', error);
                appHandler.logout();
                actions.finishAuthentication();
            }
        };

        authenticateUser();

    }, [])

    return (
        <body>
            <div id="authLayout"></div>
            {children}
        </body>
    )
}
