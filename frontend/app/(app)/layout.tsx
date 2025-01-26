import React from 'react';
import { redirect } from 'next/navigation';

import Layout, { Content } from 'antd/es/layout/layout';

import { authenticate } from '@/app/(auth)/actions';
import { getUserInfo, getUserPermissions } from '@/app/app/actions';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';

import Sidebar from '@/app/components/sidebar/Sidebar';
import Header from '@/app/components/header/Header';

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    //////////////////////////////////////////////////////////
    if (!await authenticate()) redirect("/login"); ///////////
    //////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    ///////////////////// LOAD APP STATE /////////////////////
    //////////////////////////////////////////////////////////

    /// App data \\\
    // const appDataResponse = await getAppData(); // Config, host, etc.

    /// User info \\\
    const userInfoResponse = await getUserInfo();

    /// User permissions \\\
    // const userPermissionsResponse = await getUserPermissions();

    //////////////////////////////////////////////////////////

    return (
        < Layout id="app-layout" className="app-layout" hasSider>
            {/* ////////////////////////////////////////////////////////// */}
            <StoreInitializer
                app={{
                    userInfo: userInfoResponse.data,
                    permissions: {}, // userPermissionsResponse.data
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <Sidebar />
            <Layout>
                <Header />
                <Content id="app-content" className="app-content">
                    {children}
                </Content>
            </Layout>
        </Layout >
    )
}
