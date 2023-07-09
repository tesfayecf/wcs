'use client'
import React from "react";
import LoadingSVG from "@/app/components/loadingPage/LoadingSVG";

interface ILoginProps { }

const LoadingPage: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    return (
        <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "99999" }}>
            <LoadingSVG style={{ width: "100px", height: "100px" }} />
        </div>
    )
}

export default LoadingPage;
