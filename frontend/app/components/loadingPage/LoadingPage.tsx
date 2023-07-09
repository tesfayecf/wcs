'use client'
import React from "react";
import LoadingSVG from "@/app/components/loadingPage/LoadingSVG";

interface ILoginProps { }

const LoadingPage: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    return <LoadingSVG />
}

export default LoadingPage;
