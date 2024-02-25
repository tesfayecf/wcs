import React from 'react'
import Navbar from '@/app/components/navbar/Navbar'
import { authenticate } from '@/app/lib/auth/actions';
import { getGroups, getUserInfo } from './actions';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';


type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    //////////////////////////////////////////////////////////
    await authenticate() // Authenticate user based on cookies
    //////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    ///////////////////// LOAD APP STATE /////////////////////
    //////////////////////////////////////////////////////////

    /// User info \\\
    const userInfoResponse = await getUserInfo();

    return (
        <div id="mainLayout" className={"mainLayout"}>
            <StoreInitializer
                userInfo={userInfoResponse.data}
            />
            <Navbar />
            <div id='mainContent' className={"mainContent"}>
                {children}
            </div>
        </div >
    )
}
