import { useStore } from '@/app/store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import React from 'react';

export default function useLoadingPage() {
    const { store, actions } = useStore.getState().AppStore;
    const { isLoading } = store;

    return isLoading ? <LoadingPage /> : null;
}
