'use client'
import '@/styles/globals.scss'
import React from 'react'

import UseLoadingPage from '@/app/utils/loading/useLoadingPage'

import { IAppStore } from '@/app/app/AppTypes'
import { IAuthStore } from '@/app/(auth)/AuthTypes'
import { IDashboardStore } from '@/app/(pages)/dashboard/DashboardTypes'

import RequestHandler from '@/app/utils/request/requestHandler'

import AppHandler from '@/app/app/AppHandler'
import AuthHandler from '@/app/(auth)/AuthHandler'
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler'

import AppStoreInitializer from '@/app/app/AppStoreInitializer'
import AuthStoreInitializer from '@/app/(auth)/AuthStoreInitializer'
import DashboardStoreInitializer from '@/app/(pages)/dashboard/DashboardStoreInitializer'
import RequireAuth from './utils/authentication/RequireAuth'

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

const initialAppStore: IAppStore = appHandler.setInitialAppInfo();
const initialAuthStore: IAuthStore = authHandler.setInitialAuthInfo();
const initailDasboardStore: IDashboardStore = dashboardHandler.setInitialDashboardInfo();


export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Root layout")
    return (
        <>
            <AppStoreInitializer {...initialAppStore} />
            <AuthStoreInitializer {...initialAuthStore} />
            <DashboardStoreInitializer {...initailDasboardStore} />
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>WCS</title>
                </head>
                <body>
                    <UseLoadingPage />
                    {children}
                </body>
            </html>
        </>
    )
}
