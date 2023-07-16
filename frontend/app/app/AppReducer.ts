import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppStore } from './AppTypes';

// Define the initial state
const initialState: IAppStore = {
    session: {
        isAuthenticated: false,
        isConnected: false,
        isAdmin: false,
        isStaff: false,
        isUser: false,
    },
    auth: {
        accesToken: '',
        refreshToken: '',
    },
    loading: {
        isLoading: true,
        loadingText: '',
    },
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
            state.loading.isLoading = true;
        },
        finishLoading: (state) => {
            state.loading.isLoading = false;
        },
        setAuth: (state) => {
            state.session.isAuthenticated = true;
        },
        logout: (state) => {
            state.session.isAuthenticated = false;
        },
    },
});

// Export the actions
export const appActions = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
