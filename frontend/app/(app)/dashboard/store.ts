import { create } from 'zustand';
import { IMenu } from '@/app/app/types';
import { IDashboardStore, IGroup, ISummary } from '@/app/(app)/dashboard/types';

interface IDashboardStoreActions {
    setState: (state: Partial<IDashboardStore>) => void;
    // Data
    setGroups: (groups: IGroup[]) => void;
    setSummary: (summary: ISummary) => void;
    // Group menu
    setGroupMenu: (groupMenu: IMenu) => void;
    setShowGroupMenu: (showGroupMenu: boolean) => void;
};

const useDashboardStore = create<IDashboardStore & IDashboardStoreActions>((set) => ({
    /// Store ///
    // Data
    groups: [],
    summary: {
        status: [],
        level: []
    },
    // Group menu
    groupMenu: {
        show: false,
        mode: "",
        id: 0
    },
    showGroupMenu: false,
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
    setShowGroupMenu: (showGroupMenu: boolean) => set((state) => ({ ...state, showGroupMenu: showGroupMenu })),
}));

export default useDashboardStore;
