import React from "react";
import Verify from "../lib/auth/verify";
import { verify } from "../lib/auth/actions";
import { redirect } from "next/navigation";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    ////////////////////////////////////////////////////
    if ((await verify())) redirect("/"); /////////////// Authenticate user (Server Side)
    ////////////////////////////////////////////////////

    return (
        <div id="authLayout">
            {children}
        </div>
    )
}
