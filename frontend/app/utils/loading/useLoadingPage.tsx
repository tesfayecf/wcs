'use client'
import { useStore } from '@/app/utils/store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import React, { useEffect } from 'react';

const UseLoadingPage: React.FunctionComponent = () => {
    const isLoading = useStore(state => state.AppStore.store.isLoading);
    console.log("UseLoadingPage", isLoading)

    useEffect(() => {
        console.log("isLoading changed", isLoading)
        // Get loading animation params from app state
    }, [isLoading]);

    return isLoading ? <LoadingPage /> : null;
    // return <LoadingPage />;
};

export default UseLoadingPage;
