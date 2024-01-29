import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDashboardStore, IGroup } from '@/app/(pages)/dashboard/DashboardTypes';

// Define the initial state
const initialState: IDashboardStore = {
    groups: [],
    selectedGroup: -1,

    summary: {},

    showCreateGroupMenu: false,
    showEditGroupMenu: false,
    showDeleteGroupMenu: false,
};

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSummary: (state, action: PayloadAction<{ summary: any }>) => {
            state.summary = action.payload.summary;
        },

        setGroups: (state, action: PayloadAction<{ groups: IGroup[] }>) => {
            state.groups = action.payload.groups;
        },

        setShowCreateGroupMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showCreateGroupMenu = action.payload.state;
        },
    }
});

// Export the actions
export const dashboardActions = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;
