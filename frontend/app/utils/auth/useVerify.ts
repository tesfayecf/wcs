import React from 'react';
import RequestManager from '../api/requestManager';
import AppHandler from '@/app/app/AppHandler'

const requestManager = RequestManager.getInstance();
const appHandler = AppHandler.getInstance();

export default function useVerify() {
    React.useEffect(() => {
        requestManager.request("auth", "verify", [])
            .then(() => {
                appHandler.setAuth();
            })
            .finally(() => {
                appHandler.finishInitialLoad();
            });
    }, []);
}