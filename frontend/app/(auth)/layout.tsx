import React from "react";
import Verify from "../utils/auth/verify";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    return (
        <div id="authLayout">
            <Verify />
            <h1>Login page</h1>
            {/* {children} */}
        </div>
    )
}
