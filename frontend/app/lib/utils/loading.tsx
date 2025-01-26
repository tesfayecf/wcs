'use client'
import React from "react";
import LoadingPage from "@/app/components/loadingPage/LoadingPage";
import { useAppStore } from "@/app/app/store";

interface IProps { }

const LoadingState: React.FunctionComponent<IProps> = (props: IProps) => {
    const isLoading = useAppStore(state => state.status.isLoading)
    return isLoading ? <LoadingPage /> : null
}

export default LoadingState;