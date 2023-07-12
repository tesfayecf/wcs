'use client';
import { useStore } from '@/app/utils/store/store';
import AppHandler from '../../app/AppHandler';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Redirect } from '../redirect/redirect';

const appHandler = AppHandler.getInstance();

interface Props {
    children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    console.log("RequireAuth")
    const state = useStore(state => state.AppStore.store);

    React.useEffect(() => {
        appHandler.startAuthentication();
        const authenticateUser = async () => {
            const isAuthenticated = await appHandler.authenticateUser();
            setIsAuthenticated(isAuthenticated);
        }
        authenticateUser();
        appHandler.finishAuthentication();
    }, [state.isAuthenticated])

    return state.isAuthenticated ? <>{children}</> : <Redirect to='./login' />;
}
