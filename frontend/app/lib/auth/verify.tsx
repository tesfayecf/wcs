'use client';
import React from 'react';
import { useRouter } from "next/navigation";
import { verify } from './actions';

const Verify = async () => {
    const router = useRouter();
    React.useEffect(() => {
        const verify_ = async () => { return await verify(); }
        verify_().then((isAuth) => { if (isAuth) router.push('/dashboard'); });
    }, [])
    return null
}

export default Verify;