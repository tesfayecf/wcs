'use client'
import React from "react";
import LoadingSVG from "@/app/components/loadingPage/LoadingSVG";

interface ILoadingPageProps {
    text?: string;
    overlayOpacity?: number;
    style?: React.CSSProperties;
}

const LoadingPage: React.FunctionComponent<ILoadingPageProps> = (props: ILoadingPageProps) => {
    return (
        <LoadingSVG
            text={props.text ?? ""}
            overlayOpacity={props.overlayOpacity ?? 0}
            style={props.style}
        />
    )
}

export default LoadingPage;