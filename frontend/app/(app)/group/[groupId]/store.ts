import { create } from 'zustand';
import { IGroupStore, ITank, IGroupParams } from '@/app/(app)/group/[groupId]/types';
import { IGroup, IGroupStats } from '@/app/(app)/dashboard/types';

interface IGroupActions {
    setState(state: Partial<IGroupStore>): void;
    setParams: (params: IGroupParams) => void;
    setTanks: (tanks: ITank[]) => void;
    setGroupInfo: (groupInfo: IGroup) => void;
    setGroupStats: (groupStats: IGroupStats) => void;
    setSensors: (sensors: any) => void;
    setSensorsData: (sensorsData: any) => void;
    setShowTankMenu: (state: boolean) => void;
}

const useGroupStore = create<IGroupStore & IGroupActions>((set) => ({
    /// Store ///
    groupId: -1,
    group: {
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

    tankId: -1,
    tanks: [],
    showTankMenu: false,

    /// Actions ///
    setState: (state: Partial<IGroupStore>) => set((prev) => ({ ...prev, ...state })),
    // Setters
    setParams: (params: IGroupParams) => set((state) => ({ ...state, groupId: parseInt(params.groupId) })),
    setTanks: (tanks: ITank[]) => set((state) => ({ ...state, tanks })),
    setGroupInfo: (groupInfo: IGroup) => set((state) => ({ ...state, group: groupInfo })),
    setGroupStats: (groupStats: IGroupStats) => set((state) => ({ ...state, groupStats })),
    setSensors: (sensors: any) => set((state) => ({ ...state, sensors })),
    setSensorsData: (sensorsData: any) => set((state) => ({ ...state, sensorsData })),
    setShowTankMenu: (state: boolean) => set((prevState) => ({ ...prevState, showTankMenu: state })),
}));

export default useGroupStore;
