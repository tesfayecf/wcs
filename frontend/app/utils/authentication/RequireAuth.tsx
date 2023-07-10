'use client';
import { useStore } from '@/app/utils/store/store';
import AppHandler from '../../app/AppHandler';
import React from 'react';
import { usePathname } from 'next/navigation';

const appHandler = AppHandler.getInstance();

interface Props {
    children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
    console.log("RequireAuth")
    const { isAuthenticated } = useStore(state => state.AppStore.store);

    React.useEffect(() => {
        const authenticateUser = async () => await appHandler.authenticateUser();
        authenticateUser();
    }, []);

    return isAuthenticated ? <>{children}</> : null;
}
