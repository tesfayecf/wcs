import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDashboardStore, IGroup, ITankGroupCreationForm } from './DashboardTypes';

// Define the initial state
const initialState: IDashboardStore = {
    // Add your initial state values here
    selectedTankGroup: -1,
    showDeleteTankGroupMenu: false,
    showEditTankGroupMenu: false,
    tankGroups: [],
    showAddTankGroupMenu: false,
    summary: {},
    tankGroupCreationForm: {
        name: '',
        nameError: false,
        location: "",
        locationError: false,
        description: "",
        descriptionError: false
    }
};

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSummary: (state, action: PayloadAction<{ summary: any }>) => {
            state.summary = action.payload.summary;
        },

        setTankGroups: (state, action: PayloadAction<{ tankGroups: IGroup[] }>) => {
            state.tankGroups = action.payload.tankGroups;
        },

        setShowCreateTankGroupMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showAddTankGroupMenu = action.payload.state;
        },
        setTankGroupCreationForm: (state, action: PayloadAction<{
            name?: string, nameError?: boolean, location?: string, locationError?: boolean,
            description?: string, descriptionError?: boolean
        }>) => {
            if (action.payload.name) state.tankGroupCreationForm.name = action.payload.name;
            if (action.payload.nameError) state.tankGroupCreationForm.nameError = action.payload.nameError;
            if (action.payload.location) state.tankGroupCreationForm.location = action.payload.location;
            if (action.payload.locationError) state.tankGroupCreationForm.locationError = action.payload.locationError;
            if (action.payload.description) state.tankGroupCreationForm.description = action.payload.description;
            if (action.payload.descriptionError) state.tankGroupCreationForm.descriptionError = action.payload.descriptionError;
        }
    }
});

// Export the actions
export const dashboardActions = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
