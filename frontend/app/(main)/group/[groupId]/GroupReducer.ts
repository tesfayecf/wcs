import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGroupStore, ITank, IGroupParams } from '@/app/(main)/group/[groupId]/GroupTypes';
import { IGroup, IGroupStats } from '@/app/(main)/dashboard/DashboardTypes';

// Define the initial state
const initialState: IGroupStore = {
    // Add your initial state values here
    tankId: -1,
    groupId: -1,
    tanks: [],
    sensors: [],
    sensorsData: [],
    groupInfo: {
        id: -1,
        name: '',
        location: '',
        description: '',
    },
    groupStats: {
        totalTanks: -1,
        averageWaterLevel: -1,
        minWaterLevel: -1,
        maxWaterLevel: -1,
        totalCapacity: -1,
    },

    showTankMenu: false,
};

// Create the slice
const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setParams: (state, action: PayloadAction<{ params: IGroupParams }>) => {
            state.groupId = parseInt(action.payload.params.groupId);
        },
        setTanks: (state, action: PayloadAction<{ tanks: ITank[] }>) => {
            state.tanks = action.payload.tanks;
        },
        setGroupInfo: (state, action: PayloadAction<{ groupInfo: IGroup }>) => {
            state.groupInfo = action.payload.groupInfo;
        },
        setGroupStats: (state, action: PayloadAction<{ groupStats: IGroupStats }>) => {
            state.groupStats = action.payload.groupStats;
        },
        setSensors: (state, action: PayloadAction<{ sensors: any }>) => {
            state.sensors = action.payload.sensors;
        },
        setSensorsData: (state, action: PayloadAction<{ sensorsData: any }>) => {
            state.sensorsData = action.payload.sensorsData;
        },

        // POPUP
        setShowTankMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showTankMenu = action.payload.state;
        }
    }
});

// Export the actions
export const groupActions = groupSlice.actions;

// Export the reducer
export default groupSlice.reducer;
