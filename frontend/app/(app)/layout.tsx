import React from 'react';
import { redirect } from 'next/navigation';
import Layout from 'antd/es/layout/layout';

import { authenticate } from '@/app/(auth)/actions';
import { getUserInfo } from '@/app/app/actions';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';

import RootLayoutClient from '@/app/(app)/client';

type IRootLayoutProps = { children?: React.ReactNode };

export default async function RootLayout({ children }: IRootLayoutProps) {
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

            <RootLayoutClient>{children}</RootLayoutClient>
        </Layout >
    )
}
