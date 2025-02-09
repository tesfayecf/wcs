'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { MenuItemType } from 'antd/es/menu/interface';
import { DashboardOutlined, LineChartOutlined, SettingOutlined } from '@ant-design/icons';

interface ISidebarProps { }

const Sidebar: React.FunctionComponent<ISidebarProps> = (props: ISidebarProps) => {

    const rootPath = usePathname().split("/")[1];

    return (
        <div id="sidebar" className="sidebar">
            <div className="demo-logo-vertical" style={{ height: '52px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px' }} />
            <Menu id="sidebar-menu" className="sidebar-menu" theme="dark" mode="vertical" selectedKeys={[`${rootPath}`]} items={items} />
        </div>
    )
}

export default Sidebar;

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