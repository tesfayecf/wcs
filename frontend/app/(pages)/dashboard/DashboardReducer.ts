import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDashboardStore, ITankGroup, ITankGroupCreationForm } from './DashboardTypes';

// Define the initial state
const initialState: IDashboardStore = {
    // Add your initial state values here
    selectedTankGroup: -1,
    showDeleteTankGroupMenu: false,
    showEditTankGroupMenu: false,
    tankGroups: [],
    showAddTankGroupMenu: false,
    tankGroupCreationForm: {
        name: '',
        nameError: false,
        location: "",
        locationError: false,
    }
};

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setTankGroups: (state, action: PayloadAction<{ tankGroups: ITankGroup[] }>) => {
            state.tankGroups = action.payload.tankGroups;
        },
        setShowCreateTankGroupMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showAddTankGroupMenu = action.payload.state;
        },

        setTankGroupCreationForm: (state, action: PayloadAction<{ form: ITankGroupCreationForm }>) => {
            state.tankGroupCreationForm = action.payload.form;
        },

        setTankCreationFormName: (state, action: PayloadAction<{ name: string, error: boolean }>) => {
            state.tankGroupCreationForm.name = action.payload.name;
            state.tankGroupCreationForm.nameError = action.payload.error;
        },

        setTankCreationFormLocation: (state, action: PayloadAction<{ location: string, error: boolean }>) => {
            state.tankGroupCreationForm.location = action.payload.location;
            state.tankGroupCreationForm.locationError = action.payload.error;
        },
    }
});

// Export the actions
export const dashboardActions = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
