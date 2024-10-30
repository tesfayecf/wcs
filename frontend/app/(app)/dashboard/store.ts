import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { App } from '@/app/app/types';
import { Group } from '@/app/(app)/group/[groupId]/types';
import { Dashboard } from '@/app/(app)/dashboard/types';

interface IDashboardStoreActions {
    setState: (state: Partial<Dashboard.IDashboardStore>) => void;
    // Group
    setGroups: (groups: Group.IGroup[]) => void;
    setGroupMenu: (groupMenu: App.IUserMenu) => void;
    // Weather
    setCurrentWeather: (currentWeather: Dashboard.ICurrentWeather) => void;
    setForecastWeather: (forecastWeather: Dashboard.IForecastWeather[]) => void;
};

const useDashboardStore = create(immer<Dashboard.IDashboardStore & IDashboardStoreActions>((set) => ({
    // Group
    groups: [],
    groupMenu: {
        id: 0,
        mode: "",
        show: false,
    },
    // Weather
    currentWeather: null,
    forecastWeather: [],

    /// Actions ///
    setState: (partialState: Partial<Dashboard.IDashboardStore>) => set((state) => Object.assign(state, partialState)),
    // Group
    setGroups: (groups: Group.IGroup[]) => set((state) => state.groups = groups),
    setGroupMenu: (groupMenu: App.IUserMenu) => set((state) => state.groupMenu = groupMenu),
    // Weather
    setCurrentWeather: (currentWeather: Dashboard.ICurrentWeather) => set((state) => state.currentWeather = currentWeather),
    setForecastWeather: (forecastWeather: Dashboard.IForecastWeather[]) => set((state) => state.forecastWeather = forecastWeather),
})));

export default useDashboardStore;
