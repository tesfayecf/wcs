import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITanksStore, ITankCreationForm, ITank, ITanksParams } from './TanksTypes';
import { ITankGroup } from '../dashboard/DashboardTypes';

// Define the initial state
const initialState: ITanksStore = {
    // Add your initial state values here
    tankGroupId: -1,
    showAddTankMenu: false,
    tankGroupInfo: {
        id: -1,
        name: '',
        location: '',
        description: '',
    },
    tanks: [],
    tankCreationForm: {
        name: '',
        nameError: false,
        type: 'Storage',
        typeError: false,
        capacity: "",
        capacityError: false,
        dimension: '',
        dimensionError: false,
        material: '',
        materialError: false,
        brand: '',
        brandError: false,
    }
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
        setShowAddTankMenu: (state, action: PayloadAction<{ state: boolean }>) => {
            state.showAddTankMenu = action.payload.state;
        },

        setTankCreationForm: (state, action: PayloadAction<{ form: ITankCreationForm }>) => {
            state.tankCreationForm = action.payload.form;
        },

        setTankCreationFormName: (state, action: PayloadAction<{ name: string, error: boolean }>) => {
            state.tankCreationForm.name = action.payload.name;
            state.tankCreationForm.nameError = action.payload.error;
        },

        setTankCreationFormCapacity: (state, action: PayloadAction<{ capacity: string, error: boolean }>) => {
            state.tankCreationForm.capacity = action.payload.capacity;
            state.tankCreationForm.capacityError = action.payload.error;
        },

        setTankCreationFormType: (state, action: PayloadAction<{ type: string, error: boolean }>) => {
            state.tankCreationForm.type = action.payload.type;
            state.tankCreationForm.typeError = action.payload.error;
        },

        setTankCreationFormDimension: (state, action: PayloadAction<{ dimension: string, error: boolean }>) => {
            state.tankCreationForm.dimension = action.payload.dimension;
            state.tankCreationForm.dimensionError = action.payload.error;
        },

        setTankCreationFormMaterial: (state, action: PayloadAction<{ material: string, error: boolean }>) => {
            state.tankCreationForm.material = action.payload.material;
            state.tankCreationForm.materialError = action.payload.error;
        },

        setTankCreationFormBrand: (state, action: PayloadAction<{ brand: string, error: boolean }>) => {
            state.tankCreationForm.brand = action.payload.brand;
            state.tankCreationForm.brandError = action.payload.error;
        },

    }
});

// Export the actions
export const tankActions = tankSlice.actions;

// Export the reducer
export default tankSlice.reducer;
