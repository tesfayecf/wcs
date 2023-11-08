import React from 'react'
import Footer from '@/app/components/footer/Footer'
import Navbar from '@/app/components/navbar/Navbar'
import Header from '@/app/components/header/Header'
import RequireAuth from '@/app//utils/auth/requireAuth'

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <RequireAuth>
            <div id="pagesLayout" className={"pagesLayout"}>
                <Navbar />
                <div id='pagesContent' className={"pagesContent"}>
                    <Header />
                    {children}
                    <Footer />
                </div>
            </div >
        </RequireAuth >
    )
}
