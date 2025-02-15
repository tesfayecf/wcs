'use client'
import React from "react";
import Loading from "@/app/components/loading/Loading";
import { useAppStore } from "@/app/app/store";

interface IProps { }

const LoadingState: React.FunctionComponent<IProps> = (props: IProps) => {
    const isLoading = useAppStore(state => state.status.isLoading)
    return isLoading ? <Loading /> : null
}

export default LoadingState;