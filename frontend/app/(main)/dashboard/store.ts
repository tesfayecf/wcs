import { create } from 'zustand';
import { IMenu } from '@/app/app/types';
import { IDashboardStore, IGroup, ISummary } from '@/app/(main)/dashboard/types';

interface IDashboardStoreActions {
    setGroups: (groups: IGroup[]) => void;
    setSummary: (summary: ISummary) => void;
    setGroupMenu: (groupMenu: IMenu) => void;
    setShowGroupMenu: (state: boolean) => void;
};

const useDashboardStore = create<IDashboardStore & IDashboardStoreActions>((set) => ({
    groups: [],
    summary: {
        level: [],
        inflow: [],
        outflow: [],
        savings: [],
    },
    groupMenu: {
        show: false,
        mode: "",
        id: 0
    },
    showGroupMenu: false,

    // Actions
    setSummary: (summary) => set((state) => ({ ...state, summary })),
    setGroups: (groups) => set((state) => ({ ...state, groups })),
    setGroupMenu: (groupMenu) => set((state) => ({ ...state, groupMenu })),
    setShowGroupMenu: (state) => set((prevState) => ({ ...prevState, showGroupMenu: state })),
}));

export default useDashboardStore;
