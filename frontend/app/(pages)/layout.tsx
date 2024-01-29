import React from 'react'
import Navbar from '@/app/components/navbar/Navbar'
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
                    {children}
                </div>
            </div >
        </RequireAuth >
    )
}
