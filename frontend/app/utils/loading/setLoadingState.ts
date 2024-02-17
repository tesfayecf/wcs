import React from "react";
import { store } from "@/app/utils/store/store";
import { appActions } from '@/app/app/AppReducer';

const setLoadingState = () => {
    const startLoading = () => {
        console.log("startLoading")
        store.dispatch(appActions.setIsLoading())
    }

    const stopLoading = () => {
        console.log("stopLoading")
        store.dispatch(appActions.setIsNotLoading())
    }

    return { startLoading, stopLoading };
};

export default setLoadingState;
