'use client'
import '@/styles/globals.scss'
import React from 'react'

import AppHandler from '@/app/app/AppHandler'
import AuthHandler from '@/app/(auth)/AuthHandler'
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler'
import { Provider } from 'react-redux'
import { store } from './utils/store/store'
import Setup from './utils/auth/Setup'

export const metadata = {
    title: 'WCS App',
    description: 'Web app to control water resources',
}

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

AppHandler.getInstance();
AuthHandler.getInstance();
DashboardHandler.getInstance();

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <>
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>WCS</title>
                </head>
                <body>
                    <Provider store={store}>
                        <Setup />
                        {children}
                    </Provider>
                </body>
            </html>
        </>
    )
}
