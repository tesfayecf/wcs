'use client'
import '@/styles/globals.scss'
import React from 'react'

import Footer from '@/app/components/fotter/Footer'
import Navbar from '@/app/components/navbar/Navbar'
import RequireAuth from '@/app/utils/RequireAuth'


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Pages layout")
    return (
        <body>
            <RequireAuth>
                <header>
                    <nav>
                        <Navbar />
                    </nav>
                </header>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="pagesLayout">
                    {children}
                </div>
                <Footer />
            </RequireAuth>
        </body>
    )
}
