import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDashboardStore, IDashboardActions } from './DashboardTypes';

// Define the initial state
const initialState: IDashboardStore = {
    // Add your initial state values here
    showAddTankMenu: false,
    tankCreationForm: {
        name: '',
        type: '',
        capacity: "",
        dimension: '',
        material: '',
        brand: '',
    }
};

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setShowAddTankMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showAddTankMenu = action.payload.state;
        },
        setTankCreationForm: (state, action: PayloadAction<{ form: IDashboardStore['tankCreationForm'] }>) => {
            state.tankCreationForm = action.payload.form;
        }
    }
});

// Export the actions
export const dashboardActions = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
