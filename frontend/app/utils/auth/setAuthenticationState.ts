import React from 'react';
import { store } from '../store/store';
import { appActions } from '@/app/app/AppReducer';

const setAuthenticationState = () => {
    const setIsAuthenticated = React.useCallback(() => {
        console.log("setIsAuthenticated");
        store.dispatch(appActions.setIsAuthenticated());
    }, [])

    const setIsNotAuthenticated = React.useCallback(() => {
        console.log("setIsNotAuthenticated");
        store.dispatch(appActions.setIsNotAuthenticated());
    }, [])

    return { setIsAuthenticated, setIsNotAuthenticated };
};

export default setAuthenticationState;
