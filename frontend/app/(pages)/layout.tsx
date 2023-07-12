'use client'
import '@/styles/globals.scss'
import React from 'react'

import Footer from '@/app/components/fotter/Footer'
import Navbar from '@/app/components/navbar/Navbar'
import RequireAuth from '../utils/authentication/RequireAuth'


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Pages layout")
    return (
        <div id="pagesLayout">
            <header>
                <nav>
                    <Navbar />
                </nav>
            </header>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div>
                {/* <RequireAuth> */}
                {children}
                {/* </RequireAuth> */}
            </div>
            <Footer />
        </div >
    )
}
