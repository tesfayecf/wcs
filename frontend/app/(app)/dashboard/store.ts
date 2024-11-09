import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { App } from '@/app/app/types';
import { Dashboard } from '@/app/(app)/dashboard/types';
import { Group } from '@/app/(app)/group/[groupId]/types';

interface IDashboardStoreActions {
    setState: (state: Partial<Dashboard.IDashboardStore>) => void;
    // Group
    setGroups: (groups: Group.IGroup[]) => void;
    setGroupMenu: (groupMenu: App.IUserMenu) => void;
    // Weather
    setCurrentWeather: (currentWeather: Dashboard.ICurrentWeather) => void;
    setForecastWeather: (forecastWeather: Dashboard.IForecastWeather[]) => void;
};

export const useDashboardStore = create<Dashboard.IDashboardStore & IDashboardStoreActions>()(
    immer((set) => ({
      // Initial state
      groups: [],
      groupMenu: {
        id: -1,
        mode: "info",
        show: false,
      },
      currentWeather: null,
      forecastWeather: [],
  
      // Actions
      setState: (partialState) => set((state) => { Object.assign(state, partialState); }),
      setGroups: (groups) => set((state) => { state.groups = groups; }),
      setGroupMenu: (groupMenu) => set((state) => { state.groupMenu = groupMenu; }),
      setCurrentWeather: (currentWeather) => set((state) => { state.currentWeather = currentWeather; }),
      setForecastWeather: (forecastWeather) => set((state) => { state.forecastWeather = forecastWeather; }),
    }))
);
