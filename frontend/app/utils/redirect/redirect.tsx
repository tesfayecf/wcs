'use client';

import { useEffect } from 'react';

import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';

export function Redirect({ to }: { to: string }) {
    const router = useRouter();

    useEffect(() => {
        router.replace(to);
        router.refresh();
    });

    return <LoadingPage />;
}
