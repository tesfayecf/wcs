import { create } from 'zustand';
import { IGroupStore, ITank, IGroupParams } from '@/app/(main)/group/[groupId]/GroupTypes';
import { IGroup, IGroupStats } from '@/app/(main)/dashboard/DashboardTypes';

interface IGroupActions {
    setParams: (params: IGroupParams) => void;
    setTanks: (tanks: ITank[]) => void;
    setGroupInfo: (groupInfo: IGroup) => void;
    setGroupStats: (groupStats: IGroupStats) => void;
    setSensors: (sensors: any) => void;
    setSensorsData: (sensorsData: any) => void;
    setShowTankMenu: (state: boolean) => void;
}

const useGroupStore = create<IGroupStore & IGroupActions>((set) => ({
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

    // Actions
    setParams: (params: IGroupParams) => set((state) => ({ ...state, groupId: parseInt(params.groupId) })),
    setTanks: (tanks: ITank[]) => set((state) => ({ ...state, tanks })),
    setGroupInfo: (groupInfo: IGroup) => set((state) => ({ ...state, groupInfo })),
    setGroupStats: (groupStats: IGroupStats) => set((state) => ({ ...state, groupStats })),
    setSensors: (sensors: any) => set((state) => ({ ...state, sensors })),
    setSensorsData: (sensorsData: any) => set((state) => ({ ...state, sensorsData })),
    setShowTankMenu: (state: boolean) => set((prevState) => ({ ...prevState, showTankMenu: state })),
}));

export default useGroupStore;
