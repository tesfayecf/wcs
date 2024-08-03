import React from "react";
import Verify from "../lib/auth/verify";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    ////////////////////////////////////////////////////
    // if (!(await verify())) redirect("/login"); ////// Authenticate user (Server Side)
    ////////////////////////////////////////////////////

    return (
        <div id="authLayout">
            <Verify />
            {children}
        </div>
    )
}
