import React from "react";
import Image from 'next/image'
import { redirect } from "next/navigation";
import { verify } from "../lib/auth/actions";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function RootLayout({ children }: IAppLayoutProps) {
    ///////////////////////////////////////////////////////////////////////
    if ((await verify())) redirect("/"); // Authenticate user (Server Side)
    ///////////////////////////////////////////////////////////////////////

    return (
        <div id="auth" className={"auth"}>
            {children}
            <div id="banner" className={"banner"}>
                <div id="content" className={"content"}>
                    <Image
                        id="auth-banner-image"
                        src="/banners/auth/auth-banner-1-small.png"
                        alt="Abstract picture of water flow and droplets"
                        style={{ width: "auto", height: "100%", position: "relative" }}
                        width={700}
                        height={0}
                    />
                </div>
            </div>
        </div>
    )
}
