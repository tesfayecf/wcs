import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/app/app/AppSlice'
import authReducer from '@/app/(auth)/AuthSlice'
import dashboardReducer from '@/app/(pages)/dashboard/DashboardSlice'
const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        dashboard: dashboardReducer,
    },
});

export default store;
