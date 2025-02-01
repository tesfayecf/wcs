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
                <title>WCS | Water Control System</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="A Next.js application to manage and monitor rain water control systems." />
                <meta name="author" content="WCS S.L." />
                <meta name="keywords" content="nextjs, water, control, system" />
            </head>
            <body>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    )
}
