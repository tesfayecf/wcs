import authReducer from '@/app/(auth)/authReducer';
import { configureStore } from '@reduxjs/toolkit';
import { apiReducer } from '../api/apiReducer';
import DashboardReducer from '@/app/(pages)/dashboard/DashboardReducer';
import AppReducer from '@/app/app/AppReducer';

export const store = configureStore({
  reducer: {
    // RTQ endpoints. self state managment and cache 
    [apiReducer.reducerPath]: apiReducer.reducer,

    // App state managment
    app: AppReducer,
    auth: authReducer,
    dashboard: DashboardReducer,


  },
  middleware: [],
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<(typeof store)['getState']>;
export type AppDispatch = (typeof store)['dispatch'];


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