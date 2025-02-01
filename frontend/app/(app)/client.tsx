import React from 'react';
import Layout, { 
    Header as AntDHeader,
    Content as AntDContent,
    Footer as AntDFooter,
} from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

import Sidebar from '@/app/components/layout/sidebar';
import Header from '@/app/components/layout/header';
import Footer from '@/app/components/layout/footer';

type IRootLayoutClientProps = { children?: React.ReactNode };

const RootLayoutClient: React.FunctionComponent<IRootLayoutClientProps> = ({ children }: IRootLayoutClientProps) => {
    return (
        <>
            <Sider id="app-sidebar" className="app-sidebar" breakpoint="lg" collapsedWidth="60" >
                <Sidebar />
            </Sider>
            <Layout>
                <AntDHeader id="app-header" className="app-header">
                    <Header />
                </AntDHeader>
                <AntDContent id="app-content" className="app-content">
                    {children}
                </AntDContent>
                <AntDFooter id="app-footer" className="app-footer">
                    <Footer />
                </AntDFooter>
            </Layout>
        </>
    )
}

export default RootLayoutClient;