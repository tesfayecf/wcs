'use client'
import '@/styles/globals.scss'
import React from 'react'

import Footer from '@/app/components/fotter/Footer'
import Navbar from '@/app/components/navbar/Navbar'
import AppHandler from '../app/AppHandler'
import UserVerify from '../utils/auth/userVerify'

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

const appHandler: AppHandler = AppHandler.getInstance();


export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Pages layout")
    // useVerify()

    return (
        <div id="pagesLayout">
            <UserVerify />
            <header>
                <nav>
                    <Navbar />
                </nav>
            </header>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div>
                {children}
            </div>
            <Footer />
        </div >
    )
}
