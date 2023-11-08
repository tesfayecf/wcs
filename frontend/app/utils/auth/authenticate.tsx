'use client';
import React from 'react';
import RequestManager from '@/app/utils/api/requestManager';
import AppHandler from '@/app/app/AppHandler'


const requestManager = RequestManager.getInstance();
const appHandler = AppHandler.getInstance();

export default function Authenticate() {
    React.useEffect(() => {
        const verify = async () => {
            return await requestManager.request("auth", "verify", []);
        }
        verify().then((response) => {
            if (response.isSuccess) {
                appHandler.setAuth();
                appHandler.getUserInfo();
            } else {
                if (process.env.NODE_ENV === "development") console.log("Auth failed");
            }
        }).catch((error) => {
            if (process.env.NODE_ENV === "development") console.log("Request failed", error);
        }).finally(() => {
            appHandler.finishInitialLoad();
        })
    }, []);

    return null;
}