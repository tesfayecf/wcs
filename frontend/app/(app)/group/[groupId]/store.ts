import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Group } from '@/app/(app)/group/[groupId]/types';
import { Tank } from '@/app/(app)/group/[groupId]/tank/[tankId]/types';

interface IGroupActions {
    setState(state: Partial<Group.IGroupStore>): void;
    setParams: (params: Group.IGroupParams) => void;
    setTanks: (tanks: Tank.ITank[]) => void;
    setGroupInfo: (groupInfo: Group.IGroup) => void;
    setGroupStats: (groupStats: Group.IGroupStats) => void;
    setSensors: (sensors: any) => void;
    setSensorsData: (sensorsData: any) => void;
    setShowTankMenu: (state: boolean) => void;
}

export const useGroupStore = create<Group.IGroupStore & IGroupActions>()(
    immer((set) => ({
        // Initial state
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
        setState: (state: Partial<Group.IGroupStore>) => set((prev) => ({ ...prev, ...state })),
        setParams: (params: Group.IGroupParams) => set((state) => ({ ...state, groupId: parseInt(params.groupId) })),
        setTanks: (tanks: Tank.ITank[]) => set((state) => ({ ...state, tanks })),
        setGroupInfo: (groupInfo: Group.IGroup) => set((state) => ({ ...state, group: groupInfo })),
        setGroupStats: (groupStats: Group.IGroupStats) => set((state) => ({ ...state, groupStats })),
        setSensors: (sensors: any) => set((state) => ({ ...state, sensors })),
        setSensorsData: (sensorsData: any) => set((state) => ({ ...state, sensorsData })),
        setShowTankMenu: (state: boolean) => set((prevState) => ({ ...prevState, showTankMenu: state })),
    }))
);