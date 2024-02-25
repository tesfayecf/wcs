import { Mutex } from "async-mutex";
import { store } from "@/app/lib/store/store";
import { appActions } from "@/app/app/AppReducer";
import { AxiosError, AxiosResponse } from 'axios';
import BaseManager from "@/app/lib/api/baseManager";
import { apiInterface, APIResponse } from "@/app/lib/api/interface";

const mutex = new Mutex();
type TRequestMethods = "GET" | "POST" | "DELETE";

class RequestManager extends BaseManager {
    private static instance: RequestManager;
    private constructor() {
        super();
    }

    public static getInstance(): RequestManager {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        return RequestManager.instance;
    }

    public async request<
        T extends keyof typeof apiInterface,
        S extends keyof typeof apiInterface[T],
    >(
        group: T,
        endpoint: S,
        // @ts-ignore
        args: Parameters<typeof apiInterface[T][S]["args"]>,
        authenticate: boolean = true,
        // @ts-ignore
    ): Promise<ReturnType<typeof apiInterface[T][S]["args"]>> {
        // @ts-ignore
        const { address, method, argsKeys } = apiInterface[group][endpoint as string];
        const obj = Object.fromEntries(args.map((key, index) => [argsKeys[index], key]));
        if (process.env.NODE_ENV === "development") {
            console.log(`[${group}][${endpoint as string}] -> request`, address, obj);
        }
        const reponse = await this.baseRequestWithReAuth_(method, address, obj, authenticate);
        if (process.env.NODE_ENV === "development") {
            console.log(`[${group}][${endpoint as string}] -> response`, reponse);
        }
        return reponse;
    }

    private async baseRequestWithReAuth_<
        T extends keyof typeof apiInterface,
        S extends keyof typeof apiInterface[T]
    >(method: TRequestMethods, address: string, obj: any, authenticate: boolean = true
        // @ts-ignore
    ): Promise<ReturnType<typeof apiInterface[T][S]["args"]>> {
        await mutex.waitForUnlock();
        // @ts-ignore
        let response: ReturnType<typeof apiInterface[T][S]["args"]> = await this.baseRequest_(method, address, obj, authenticate);
        // @ts-ignore
        if (response.isClientError && response.status === 401) {
            if (!mutex.isLocked()) {
                response = await this.reAuthRequest_(method, address, obj, authenticate);
            } else {
                await mutex.waitForUnlock();
                response = await this.reAuthRequest_(method, address, obj, authenticate);
            }
        }
        return response;
    }

    private async reAuthRequest_(method: TRequestMethods, address: string, obj: any, authenticate: boolean = true) {
        let response;
        const release = await mutex.acquire();
        try {
            const refreshResponse: APIResponse<any> = await this.baseRequest_("POST", "api/auth/refresh/", obj, false);
            if (refreshResponse.data) {
                store.dispatch(appActions.setAccessToken({ accesToken: refreshResponse.data.access }));
                store.dispatch(appActions.setRefreshToken({ refreshToken: refreshResponse.data.refresh }));
                response = await this.baseRequest_(method, address, obj, authenticate);
            } else {
                response = await this.baseRequest_("POST", "api/auth/logout/", {})
            }
        } finally {
            release();
        }
        return response;
    }

    private async baseRequest_<
        T extends keyof typeof apiInterface,
        S extends keyof typeof apiInterface[T]
    >(method: TRequestMethods, address: string, obj: any, authenticate: boolean = true
        // @ts-ignore
    ): Promise<ReturnType<typeof apiInterface[T][S]["args"]>> {
        let token = undefined;
        // if (authenticate) token = store.getState().app.authenticationState.accesToken
        try {
            const response: AxiosResponse = await this.request_api.request({
                method,
                url: `http://127.0.0.1:8000/${address}`,
                data: obj,
                headers: {
                    Authorization: authenticate ? `Bearer ${token}` : null,
                },
                withCredentials: true,
            });
            // @ts-ignore
            return await this.mapAxiosResponse_(response) as Promise<ReturnType<typeof apiInterface[T][S]["args"]>>;
        } catch (error) {
            // @ts-ignore
            return await this.mapAxiosError_(error) as Promise<ReturnType<typeof apiInterface[T][S]["args"]>>;
        }
    }

    private mapAxiosResponse_<T>(response: AxiosResponse<T>): APIResponse<T> {
        return this.mapAxiosData_<T>(response, response.status);
    }

    private mapAxiosError_<T>(error: AxiosError<T>): APIResponse<T> {
        const status = error.response?.status || (error.message.includes('Network Error') ? 0 : undefined);
        return this.mapAxiosData_<T>(error.response, status, error.message);
    }

    private mapAxiosData_<T>(
        response: AxiosResponse<T> | undefined,
        status: number | undefined,
        errorMessage?: string
    ): APIResponse<T> {
        const isSuccess = status !== undefined && status >= 200 && status < 300;
        const isRedirect = status !== undefined && status >= 300 && status < 400;
        const isClientError = status !== undefined && status >= 400 && status < 500;
        const isServerError = status !== undefined && status >= 500;

        return {
            data: response.data,
            request: response?.request,
            status: status,
            statusText: response?.statusText,
            headers: response?.headers,
            config: response?.config,
            error: errorMessage || response?.data,
            isSuccess: isSuccess,
            isRedirect: isRedirect,
            isClientError: isClientError,
            isServerError: isServerError,
        };
    }
}

export default RequestManager;