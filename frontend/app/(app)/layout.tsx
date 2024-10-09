import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { MenuItemType } from 'antd/es/menu/interface';
import Layout, { Header, Content } from 'antd/es/layout/layout';
import { DashboardOutlined, LineChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';

import { authenticate } from '@/app/(auth)/actions';
import { getUserInfo } from '@/app/app/actions';
import { StoreInitializer } from '@/app/lib/store/StoreInitializer';


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
    // const appDataResponse = await getAppData();

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
                }}
            />
            {/* ////////////////////////////////////////////////////////// */}

            <Sider id="sidebar" className="sidebar" breakpoint="lg" collapsedWidth="60">
                <div className="demo-logo-vertical" style={{ height: '52px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px' }} />
                <Menu id="sidebar-menu" className="sidebar-menu" theme="dark" mode="vertical" selectedKeys={['dashboard']} items={items} />
            </Sider>
            <Layout>
                <Header id="header" className="header" title='prova'>
                    <Button id="header-button" className="header-button" type="text" icon={false ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                </Header>
                <Content id="app-content" className="app-content">
                    {children}
                </Content>
            </Layout>
        </Layout >
    )
}

const items: MenuItemType[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlined size={25} style={{ strokeWidth: 1.2, fill: 'black' }} />,
        type: "item",
        extra: <Link href="/dashboard" />,
    },
    {
        key: 'analytics',
        label: 'Analytics',
        icon: <LineChartOutlined size={25} style={{ strokeWidth: 1.2, fill: 'black' }} />,
        type: "item",
        extra: <Link href="/analytics" />,
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined size={25} style={{ strokeWidth: 1.2, fill: 'black' }} />,
        type: "item",
        extra: <Link href="/settings" />,
    }
]