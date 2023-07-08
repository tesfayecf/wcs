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

import { redirect } from 'next/navigation';
import { useStore } from '@/app/store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import AppHandler from '../app/AppHandler';
import React from 'react';

const appHandler = AppHandler.getInstance();

interface Props {
    children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
    const { store, actions } = useStore.getState().AppStore;
    const { isAuthenticated, isLoading } = store;
    React.useEffect(() => {
        actions.startAuthentication();
        // Perform authentication logic here, such as checking token validity, refreshing tokens, etc.
        const authenticateUser = async () => {
            try {
                // Simulated asynchronous authentication process
                await appHandler.authenticateUser(); // Assuming authenticateUser is a method in your authentication service

                // Authentication success
                // actions.finishAuthentication(); // Set isAuthenticated to true
                actions.finishAuthentication();
            } catch (error) {
                // Authentication error
                console.error('Authentication error:', error);
                actions.finishAuthentication();
                redirect('/login');
            }
        };

        authenticateUser();
    }, []);

    return isAuthenticated ? <>{children}</> : <LoadingPage />;
}
