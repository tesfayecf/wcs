import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { appActions } from '@/app/app/AppReducer';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
    credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, slice, extraOptions) => {

    await mutex.waitForUnlock();
    let result = await baseQuery(args, slice, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    {
                        url: '/jwt/refresh/',
                        method: 'POST',
                    },
                    slice,
                    extraOptions
                );
                if (refreshResult.data) {
                    slice.dispatch(appActions.setAuth());
                    result = await baseQuery(args, slice, extraOptions);
                } else {
                    slice.dispatch(appActions.logout());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, slice, extraOptions);
        }
    }
    return result;
};