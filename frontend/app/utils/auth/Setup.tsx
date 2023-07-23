'use client';
import React from 'react';
import RequestManager from '../api/requestManager';
import AppHandler from '@/app/app/AppHandler'


const requestManager = RequestManager.getInstance();
const appHandler = AppHandler.getInstance();

export default function Setup() {
    React.useEffect(() => {
        const verify = async () => {
            return await requestManager.request("auth", "verify", []);
        }
        verify().then((response) => {
            if (response.status === 200) {
                appHandler.setAuth();
                appHandler.getUserInfo();
            } else {
                if (process.env.NODE_ENV === "development") console.log("Auth failed");
            }
        }).finally(() => {
            appHandler.finishInitialLoad();
        })
    }, []);

    return null;
}