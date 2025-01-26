'use client'
import React from 'react'

import { Button } from 'antd';
import { Header as AntDHeader } from 'antd/es/layout/layout';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface IHeaderProps { }

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {

    return (
        <AntDHeader id="header" className="header" title='prova'>
            <Button id="header-button" className="header-button" type="text" icon={false ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
        </AntDHeader>
    )
}

export default Header