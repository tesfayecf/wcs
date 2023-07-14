'use client'
import '@/styles/globals.scss'
import React from 'react'
import UserVerify from '../utils/auth/userVerify'

import Footer from '@/app/components/fotter/Footer'
import Navbar from '@/app/components/navbar/Navbar'


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    console.log("Pages layout")

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
