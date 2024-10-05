import React from "react";
import Image from 'next/image'
import { redirect } from "next/navigation";
import { verify } from "../lib/auth/actions";

type IAppLayoutProps = {
    children: React.ReactNode[] | React.ReactNode | undefined | null;
}

export default async function AuthLayout({ children }: IAppLayoutProps) {
    ///////////////////////////////////////////////////////////////////////
    // if ((await verify())) redirect("/"); // Authenticate user (Server Side)
    ///////////////////////////////////////////////////////////////////////

    return (
        <div id="auth-layout" className={"auth-layout"}>
            <div id="form" className={"form"}>
                {children}
            </div>
            <div id="banner" className={"banner"}>
                <div id="image" className={"image"}>
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
