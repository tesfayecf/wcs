'use client'
import React from "react";
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

    return (
        <div id="authLayout">
            {children}
        </div>
    )
}
