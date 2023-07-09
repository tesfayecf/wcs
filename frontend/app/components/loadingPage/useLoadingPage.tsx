import { useStore } from '@/app/store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import React from 'react';

const UseLoadingPage: React.FunctionComponent = () => {
    const { store, actions } = useStore.getState().AppStore;
    const { isLoading } = store;

    React.useEffect(() => {
        console.log("useLoadingPage")
    }, [isLoading])


    return isLoading ? <LoadingPage /> : null;
    // return <LoadingPage />;
    // return isLoading ? <div><h1>Loading...</h1></div> : null
}

export default UseLoadingPage;