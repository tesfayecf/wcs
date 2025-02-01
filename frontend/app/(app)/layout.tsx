import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Layout, { Content as AntDContent, Header as AntDHeader, Footer as AntDFooter } from 'antd/es/layout/layout';

import { authenticate } from '@/app/(auth)/actions';
import { getUserInfo } from '@/app/app/actions';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';

import Sidebar from '@/app/components/sidebar/Sidebar';

type IAppLayoutProps = { children?: React.ReactNode };

export default async function RootLayout({ children }: IAppLayoutProps) {
    //////////////////////////////////////////////////////////
    if (!await authenticate()) redirect("/login"); ///////////
    //////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    ///////////////////// LOAD APP STATE /////////////////////
    //////////////////////////////////////////////////////////

    const [ userInfoResponse ] = await Promise.all([
        /// App data \\\
        // getAppData(), // Config, host, etc.
        /// User info \\\
        getUserInfo()
        /// User permissions \\\
        // getUserPermissions()
    ])

    //////////////////////////////////////////////////////////

    return (
        < Layout id="app-layout" className="app-layout" hasSider>
            {/* ////////////////////////////////////////////////////////// */}
            <StoreInitializer
                app={{
                    user: userInfoResponse.data,
                    permissions: {
                        isAuthenticated: true,
                        isAdmin: true,
                    },
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <Sidebar />
            <Layout>
                <AntDHeader>
                    <Suspense fallback={<div>Loading...</div>}>
                        <div id="header" className="header">Header</div>
                    </Suspense>
                </AntDHeader>
                <AntDContent id="app-content" className="app-content">
                    {children}
                </AntDContent>
                <AntDFooter>
                    <div id="footer" className="footer">Footer</div>
                </AntDFooter>
            </Layout>
        </Layout >
    )
}
