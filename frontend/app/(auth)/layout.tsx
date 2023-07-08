'use client'
import React from "react";
import { redirect } from 'next/navigation';
import { useStore } from "../store/store";

export const metadata = {
    title: 'WCS App',
    description: 'Web app to control water resources',
}

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Auth layout")
    const { isAuthenticated } = useStore((state) => state.AppStore.store);

    React.useEffect(() => {
        if (isAuthenticated) {
            redirect("/dashboard");
        }
    }, [])

    return (
        <body>
            <div id="authLayout"></div>
            {children}
        </body>
    )
}
