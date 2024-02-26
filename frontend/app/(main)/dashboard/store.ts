import { create } from 'zustand';
import { IMenu } from '@/app/app/types';
import { IDashboardStore, IGroup } from '@/app/(main)/dashboard/types';

interface IDashboardStoreActions {
    setGroups: (groups: IGroup[]) => void;
    setSummary: (summary: any) => void;
    setGroupMenu: (groupMenu: IMenu) => void;
    setShowGroupMenu: (state: boolean) => void;
};

const useDashboardStore = create<IDashboardStore & IDashboardStoreActions>((set) => ({
    groups: [],
    summary: {},
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
