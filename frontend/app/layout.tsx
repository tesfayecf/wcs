'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/utils/store/store'
import "../styles/app.css"

import AppHandler from '@/app/app/AppHandler'
import AuthHandler from '@/app/(auth)/AuthHandler'
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler'

import Authenticate from './utils/auth/authenticate'
import LogHandler from './app/LogHandler'
import TanksHandler from './(pages)/tanks/TanksHandler'

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

AppHandler.getInstance();
LogHandler.getInstance();
AuthHandler.getInstance();
DashboardHandler.getInstance();
TanksHandler.getInstance();

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
                        <Authenticate />
                        {children}
                    </Provider>
                </body>
            </html>
        </>
    )
}
