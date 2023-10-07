import { configureStore } from '@reduxjs/toolkit';

import appReducer from '@/app/app/AppReducer';
import authReducer from '@/app/(auth)/AuthReducer';
import dashboardReducer from '@/app/(pages)/dashboard/DashboardReducer';
import GroupReducer from '@/app/(pages)/group/GroupReducer';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    group: GroupReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;
export type TStoreDispatch = typeof store.dispatch;