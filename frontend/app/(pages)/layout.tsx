import React from 'react'
import Navbar from '@/app/components/navbar/Navbar'
import AuthenticationState from '../utils/auth/AuthenticationState';

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <AuthenticationState checkAuth={true} requireAuth={true}>
            <div id="pagesLayout" className={"pagesLayout"}>
                <Navbar />
                <div id='pagesContent' className={"pagesContent"}>
                    {children}
                </div>
            </div >
        </AuthenticationState >
    )
}
