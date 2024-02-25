import { create } from 'zustand';
import { IDashboardStore, IGroup } from '@/app/(main)/dashboard/types';

interface IDashboardStoreActions {
    setGroups: (groups: IGroup[]) => void;
    setSummary: (summary: any) => void;
    setShowGroupMenu: (state: boolean) => void;
};

const useDashboardStore = create<IDashboardStore & IDashboardStoreActions>((set) => ({
    groups: [],
    summary: {},
    showGroupMenu: false,

    // Actions
    setSummary: (summary) => set((state) => ({ ...state, summary })),
    setGroups: (groups) => set((state) => ({ ...state, groups })),
    setShowGroupMenu: (state) => set((prevState) => ({ ...prevState, showGroupMenu: state })),
}));

export default useDashboardStore;
