'use client'
import React from "react";
import LoadingSVG from "@/app/components/loading/LoadingSVG";

interface ILoadingProps {
    text?: string;
    overlayOpacity?: number;
    style?: React.CSSProperties;
}

const Loading: React.FunctionComponent<ILoadingProps> = (props: ILoadingProps) => {
    return (
        <LoadingSVG
            text={props.text ?? ""}
            overlayOpacity={props.overlayOpacity ?? 0}
            style={props.style}
        />
    )
}

export default Loading;