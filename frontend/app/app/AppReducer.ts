import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppStore, IUserInfo } from '@/app/app/AppTypes';

// Define the initial state
const initialState: IAppStore = {
    session: {
        isConnected: false,
        isAdmin: false,
        isStaff: false,
        isUser: false,
    },
    authenticationState: {
        isAuthenticated: false,
        accesToken: '',
        refreshToken: '',
    },
    loadingState: {
        isLoading: true,
        isFormLoading: false,
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
        setIsLoading: (state) => {
            state.loadingState.isLoading = true;
        },
        setIsNotLoading: (state) => {
            state.loadingState.isLoading = false;
        },
        // setLoadingText: (state, action: PayloadAction<{ loadingText: string }>) => {
        //     state.loadingState.loadingText = action.payload.loadingText;
        // },
        // startFormLoading: (state) => {
        //     state.loadingState.isFormLoading = true;
        // },
        // stopFormLoading: (state) => {
        //     state.loadingState.isFormLoading = false;
        // },
        setIsAuthenticated: (state) => {
            state.authenticationState.isAuthenticated = true;
        },
        setIsNotAuthenticated: (state) => {
            state.authenticationState.isAuthenticated = false;
        },
        setAccessToken: (state, action: PayloadAction<{ accesToken: string }>) => {
            state.authenticationState.accesToken = action.payload.accesToken; // Store in cookies
        },
        removeAccesToken: (state) => {
            state.authenticationState.accesToken = '';
        },
        setRefreshToken: (state, action: PayloadAction<{ refreshToken: string }>) => {
            state.authenticationState.refreshToken = action.payload.refreshToken;
        },
        removeRefreshToken: (state) => {
            state.authenticationState.refreshToken = '';
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
