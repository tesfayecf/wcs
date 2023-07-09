'use client';

// import { redirect } from 'next/navigation';
// import { useStore } from '@/app/store/store';
// import LoadingPage from "@/app/components/loadingPage/LoadingPage";
// import AppHandler from '../app/AppHandler';
// import React from 'react';

// const appHandler = AppHandler.getInstance();

// interface Props {
//     children: React.ReactNode;
// }

// export default function RequireAuth({ children }: Props) {
//     const { store, actions } = useStore.getState().AppStore;
//     const { isAuthenticated, isLoading } = store;

//     React.useEffect(() => {
//         console.log("actions.startAuthentication();")
//         actions.startAuthentication();
//     }, [])

//     if (!isAuthenticated) {
//         actions.finishInitialLoad();
//         redirect('/login');
//     }

//     if (isLoading) return <LoadingPage />
//     return <>{children}</>;
// }

// import { redirect } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useStore } from '@/app/store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import AppHandler from '../../app/AppHandler';
import React from 'react';

const appHandler = AppHandler.getInstance();

interface Props {
    children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
    console.log("RequireAuth")
    const { actions } = useStore.getState().AppStore;
    const { isLoading, isAuthenticated } = useStore(state => state.AppStore.store);


    React.useEffect(() => {
        actions.startAuthentication();

        //put in the handler( done like this because async)
        const authenticateUser = async () => {
            await appHandler.authenticateUser();
        };

        authenticateUser();
        actions.finishAuthentication();
    }, []);
    return isAuthenticated ? <>{children}</> : null;
    // return <>{children}</>;
}
