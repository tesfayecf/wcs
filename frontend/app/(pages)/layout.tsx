'use client'
import React from 'react'
import styles from "./Layout.module.scss"
import Footer from '@/app/components/footer/Footer'
import RequireAuth from '../utils/auth/requireAuth'
import Navbar from '../components/navbar/Navbar'
import Header from '@/app/components/header/Header'

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <RequireAuth>
            <div id="pagesLayout" className={styles.pagesLayout}>
                <Navbar />
                <div id='pagesContent' className={styles.pagesContent}>
                    <Header />
                    {children}
                    <Footer />
                </div>
            </div >
        </RequireAuth>
    )
}
