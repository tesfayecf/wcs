'use client'
import React from 'react'

import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface IHeaderProps { }

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {

    return (
        <div id="header" className="header">
            <React.Suspense fallback={<div>Loading...</div>}>
                <Button id="button" className="button" type="text" icon={false ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
            </React.Suspense>
        </div>
    )
}

export default Header;