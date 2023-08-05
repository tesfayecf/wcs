import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITanksStore, ITankCreationForm, ITank, ITanksParams } from './TanksTypes';
import { ITankGroup, ITankGroupStats } from '../dashboard/DashboardTypes';

// Define the initial state
const initialState: ITanksStore = {
    // Add your initial state values here
    tankId: -1,
    tankGroupId: -1,
    tanks: [],
    sensors: [],
    sensorsData: [],
    tankGroupInfo: {
        id: -1,
        name: '',
        location: '',
        description: '',
    },
    tankGroupStats: {
        totalTanks: -1,
        averageWaterLevel: -1,
        minWaterLevel: -1,
        maxWaterLevel: -1,
        totalCapacity: -1,
    },
    tankCreationForm: {
        name: '',
        nameError: false,
        type: 'Storage',
        typeError: false,
        capacity: 0,
        capacityError: false,
        dimensions: '',
        dimensionsError: false,
        material: '',
        materialError: false,
        brand: '',
        brandError: false,
    },
    showAddTankMenu: false,
};

// Create the slice
const tankSlice = createSlice({
    name: 'tank',
    initialState,
    reducers: {
        setParams: (state, action: PayloadAction<{ params: ITanksParams }>) => {
            state.tankGroupId = parseInt(action.payload.params.tankGroupId);
        },
        setTanks: (state, action: PayloadAction<{ tanks: ITank[] }>) => {
            state.tanks = action.payload.tanks;
        },
        setTankGroupInfo: (state, action: PayloadAction<{ tankGroupInfo: ITankGroup }>) => {
            state.tankGroupInfo = action.payload.tankGroupInfo;
        },
        setTankGroupStats: (state, action: PayloadAction<{ tankGroupStats: ITankGroupStats }>) => {
            state.tankGroupStats = action.payload.tankGroupStats;
        },
        setSensors: (state, action: PayloadAction<{ sensors: any }>) => {
            state.sensors = action.payload.sensors;
        },
        setSensorsData: (state, action: PayloadAction<{ sensorsData: any }>) => {
            state.sensorsData = action.payload.sensorsData;
        },

        // POPUP
        setShowAddTankMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showAddTankMenu = action.payload.state;
        },
        setTankCreationForm: (state, action: PayloadAction<{
            name?: string, nameError?: boolean, type?: string, typeError?: boolean,
            capacity?: number, capacityError?: boolean, dimensions?: string, dimensionsError?: boolean,
            material?: string, materialError?: boolean, brand?: string, brandError?: boolean
        }>) => {
            if (action.payload.name) state.tankCreationForm.name = action.payload.name;
            if (action.payload.nameError) state.tankCreationForm.nameError = action.payload.nameError;
            if (action.payload.type) state.tankCreationForm.type = action.payload.type;
            if (action.payload.typeError) state.tankCreationForm.typeError = action.payload.typeError;
            if (action.payload.capacity) state.tankCreationForm.capacity = action.payload.capacity;
            if (action.payload.capacityError) state.tankCreationForm.capacityError = action.payload.capacityError;
            if (action.payload.dimensions) state.tankCreationForm.dimensions = action.payload.dimensions;
            if (action.payload.dimensionsError) state.tankCreationForm.dimensionsError = action.payload.dimensionsError;
            if (action.payload.material) state.tankCreationForm.material = action.payload.material;
            if (action.payload.materialError) state.tankCreationForm.materialError = action.payload.materialError;
            if (action.payload.brand) state.tankCreationForm.brand = action.payload.brand;
            if (action.payload.brandError) state.tankCreationForm.brandError = action.payload.brandError;
        },
    }
});

// Export the actions
export const tankActions = tankSlice.actions;

// Export the reducer
export default tankSlice.reducer;
