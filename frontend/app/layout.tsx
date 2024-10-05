import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "../styles/app.css"

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>WCS</title>
            </head>
            <body>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    )
}
