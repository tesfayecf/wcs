import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/app/utils/api/baseQueryWithReauth'


export const apiReducer = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
});

