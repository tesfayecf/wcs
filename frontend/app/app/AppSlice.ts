import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppStore, IAppActions } from './AppTypes';

// Define the initial state
const initialState: IAppStore = {
    isAuthenticated: false,
    isLoading: false,
    isConnected: false,
    isAdmin: false,
    isStaff: false,
    isUser: false,
    checkValue: 0,
    userInfo: {
        id: -1,
        name: '',
        email: '',
        role: 'user',
        status: 'inactive',
        lastLogin: '',
    },
};

// Create the slice
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        finishLoading: (state) => {
            state.isLoading = false;
        },
        startAuthentication: (state) => {
            state.isLoading = true;
        },
        finishAuthentication: (state) => {
            state.isLoading = false;
        },
        setAuth: (state) => {
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
        },
    },
});

// Export the actions
export const appActions = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
