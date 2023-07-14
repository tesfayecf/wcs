'use client'
import React from "react";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default function RootLayout({ children }: IAppLayoutProps) {
    return (
        <div id="authLayout">
            {children}
        </div>
    )
}
