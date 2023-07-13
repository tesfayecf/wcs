import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDashboardStore, IDashboardActions, ITankCreationForm } from './DashboardTypes';

// Define the initial state
const initialState: IDashboardStore = {
    // Add your initial state values here
    showAddTankMenu: false,
    tankCreationForm: {
        name: '',
        type: 'Storage',
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

        // TODO: Make request for each key
        setTankCreationForm: (state, action: PayloadAction<{ form: ITankCreationForm }>) => {
            state.tankCreationForm = action.payload.form;
        }
    }
});

// Export the actions
export const dashboardActions = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
