import React from 'react'
import Navbar from '@/app/components/navbar/Navbar'
import { authenticate } from '../utils/auth/actions';


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {

    // Run server action to authenticate user based on cookies
    await authenticate()

    return (
        <div id="pagesLayout" className={"pagesLayout"}>
            <Navbar />
            <div id='pagesContent' className={"pagesContent"}>
                <h1>Dashboard page</h1>
                {/* {children} */}
            </div>
        </div >
    )
}
