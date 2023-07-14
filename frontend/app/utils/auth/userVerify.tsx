'use client'
import React, { useEffect } from 'react';
import { RequestManager } from '../request/requestManagerOLD';

const requestManager = RequestManager.getInstance();

export default function UserVerify() {
    useEffect(() => {
        requestManager.callEndpoint('AUTH', 'verify', {});
    }, []);

    return null;
}