import React from "react";
import Verify from "../lib/auth/verify";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    return (
        <div id="authLayout">
            <Verify />
            {children}
        </div>
    )
}
