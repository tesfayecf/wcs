import React from 'react'
import { redirect } from 'next/navigation';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';
import { authenticate } from '@/app/lib/auth/actions';
import { getUserInfo } from '@/app/(main)/actions';
import Navbar from '@/app/components/navbar/Navbar'


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    //////////////////////////////////////////////////////////
    if (!await authenticate()) redirect("/login"); /////////// Authenticate user
    //////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    ///////////////////// LOAD APP STATE /////////////////////
    //////////////////////////////////////////////////////////

    /// User info \\\
    const userInfoResponse = await getUserInfo();

    return (
        <div id="mainLayout" className={"mainLayout"}>
            <StoreInitializer
                app={{
                    userInfo: userInfoResponse.data,
                }}
            />
            <Navbar />
            <div id='mainContent' className={"mainContent"}>
                {children}
            </div>
        </div >
    )
}
