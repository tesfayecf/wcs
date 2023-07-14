import { configureStore } from '@reduxjs/toolkit';

import { apiReducer } from '../api/apiReducer';
import appReducer from '@/app/app/AppReducer';
import authReducer from '@/app/(auth)/AuthReducer';
import dashboardReducer from '@/app/(pages)/dashboard/DashboardReducer';

export const store = configureStore({
  reducer: {
    // RTQ endpoints. self state managment and cache 
    [apiReducer.reducerPath]: apiReducer.reducer,

    // App state managment
    app: appReducer,
    auth: authReducer,
    dashboard: dashboardReducer,


  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiReducer.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type IRootState = ReturnType<(typeof store)['getState']>;
export type TStoreDispatch = (typeof store)['dispatch'];




/**
// API configuration
const api1 = createApi({
  reducerPath: 'api1',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api1.example.com' }),
  endpoints: (builder) => ({
    // Define endpoints for API 1
    // ...
  }),
});

const api2 = createApi({
  reducerPath: 'api2',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api2.example.com' }),
  endpoints: (builder) => ({
    // Define endpoints for API 2
    // ...
  }),
});

// Root store configuration
const store = configureStore({
  reducer: {
    [api1.reducerPath]: api1.reducer,
    [api2.reducerPath]: api2.reducer,
    // Add reducers for other slices in the store
    // ...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api1.middleware, api2.middleware),
});
 */