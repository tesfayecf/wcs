import { create } from 'zustand';
import { IMenu } from '@/app/app/types';
import { IDashboardStore, IGroup, ISummary } from '@/app/(app)/dashboard/types';

interface IDashboardStoreActions {
    setState: (state: Partial<IDashboardStore>) => void;
    // Group
    setGroups: (groups: IGroup[]) => void;
    // Group menu
    setGroupMenu: (groupMenu: IMenu) => void;
    // Stats
    setSummary: (summary: ISummary) => void;
};

const useDashboardStore = create<IDashboardStore & IDashboardStoreActions>((set) => ({
    /// Store ///
    // Group
    groups: [],
    // Group menu
    groupMenu: {
        show: false,
        mode: "",
        id: 0
    },
    // Stats
    summary: {
        status: [],
        level: []
    },
    // Weather
    currentWeather: null,
    forecastWeather: [],

    /// Actions ///
    setState: (state: Partial<IDashboardStore>) => set((prev) => ({ ...prev, ...state })),
    // Data
    setGroups: (groups: IGroup[]) => set((state) => ({ ...state, groups })),
    setSummary: (summary: ISummary) => set((state) => ({ ...state, summary })),
    // Group menu
    setGroupMenu: (groupMenu: IMenu) => set((state) => ({ ...state, groupMenu })),
}));

export default useDashboardStore;
