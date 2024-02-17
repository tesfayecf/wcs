'use client';
import React from 'react';
import RequestManager from '@/app/utils/api/requestManager';
import { useRouter } from "next/navigation";
import setAuthenticationState from './setAuthenticationState';

const requestManager = RequestManager.getInstance();


const Authenticate = () => {
    const router = useRouter();
    const { setIsAuthenticated, setIsNotAuthenticated } = setAuthenticationState()

    React.useEffect(() => {
        console.log("Authenticate user")
        const verify = async () => { return await requestManager.request("auth", "verify", []) };
        verify().then((response) => {
            // Improve request manager error management
            if (response.isSuccess) setIsAuthenticated()
            else {
                setIsNotAuthenticated()
                router.push("/login")
            }
        }).catch((error) => {
            setIsNotAuthenticated()
            router.push("/login")
        })
    })

    return null
}

export default Authenticate;