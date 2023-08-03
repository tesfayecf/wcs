'use client'
import '@/styles/globals.scss'
import React from 'react'

import Footer from '@/app/components/fotter/Footer'
// import Navbar from '@/app/components/navbar/Navbar'
import RequireAuth from '../utils/auth/requireAuth'
import NavbarNew from '../components/navbar/NavbarNew'


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <RequireAuth>
            <div id="pagesLayout">
                <header>
                    <nav>
                        <NavbarNew />
                    </nav>
                </header>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div>
                    {children}
                </div>
                <Footer />
            </div >
        </RequireAuth>
    )
}
