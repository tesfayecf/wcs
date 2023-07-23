import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppStore, IUserInfo } from './AppTypes';

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
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        status: 'inactive',
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
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.auth.accesToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.auth.refreshToken = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
            state.userInfo = action.payload;
        }
    }
});

// Export the actions
export const appActions = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
