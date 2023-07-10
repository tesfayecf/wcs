'use client'
import React from "react";
import { redirect } from 'next/navigation';
import { useStore } from "../utils/store/store";
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

    React.useEffect(() => {
        appHandler.startAuthentication();
        const authenticateUser = async () => await appHandler.authenticateUser();
        authenticateUser();
        appHandler.finishAuthentication();
    }, [])

    return (
        <div id="authLayout">
            {children}
        </div>
    )
}
