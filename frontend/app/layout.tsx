'use client'
import '@/styles/globals.scss'
import React from 'react'

import RequestHandler from '@/app/utils/request/requestHandler'

import AppHandler from '@/app/app/AppHandler'
import AuthHandler from '@/app/(auth)/AuthHandler'
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler'
import CustomProvider from '@/app/utils/store/provider'

export const metadata = {
    title: 'WCS App',
    description: 'Web app to control water resources',
}

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

const requestHandler: RequestHandler = RequestHandler.getInstance();

const appHandler: AppHandler = AppHandler.getInstance();
const authHandler: AuthHandler = AuthHandler.getInstance();
const dashboardHandler: DashboardHandler = DashboardHandler.getInstance();

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Root layout")
    return (
        <>
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>WCS</title>
                </head>
                <body>
                    <CustomProvider>
                        {children}
                    </CustomProvider>
                </body>
            </html>
        </>
    )
}
