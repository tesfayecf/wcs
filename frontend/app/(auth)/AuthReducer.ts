import { createSlice } from '@reduxjs/toolkit';
import { IAuthStore } from '@/app/(auth)/AuthTypes';


// Define the initial state
const initialState: IAuthStore = {};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
});

// Export the actions
export const authActions = authSlice.actions;

// Export the reducer
export default authSlice.reducer;