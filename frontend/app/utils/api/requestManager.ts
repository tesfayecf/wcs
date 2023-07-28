import { Mutex } from "async-mutex";
import { APIInterface, APIResponse } from "./apiInterface";
import { AxiosError, AxiosResponse } from 'axios';
import { store } from "../store/store";
import { appActions } from "@/app/app/AppReducer";
import BaseManager from "./baseManager";
const mutex = new Mutex();

type TRequestMethods = "GET" | "POST" | "DELETE";

class RequestManager extends BaseManager {
    private static instance: RequestManager;
    private constructor() {
        super();
        console.log("RequestManager constructor");
    }

    public static getInstance(): RequestManager {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        console.log("RequestManager getInstance()");
        return RequestManager.instance;
    }

    public async request<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T],
    >(
        group: T,
        endpoint: S,
        // @ts-ignore
        args: Parameters<typeof APIInterface[T][S]["args"]>,
        authenticate: boolean = true,
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        // @ts-ignore
        const { address, method, argsKeys } = APIInterface[group][endpoint as string];
        const obj = Object.fromEntries(args.map((key, index) => [argsKeys[index], key]));
        const reponse = await this.baseRequestWithReAuth_(method, address, obj, authenticate);
        if (process.env.NODE_ENV === "development") {
            console.log(`[${group}][${endpoint as string}]`, reponse);
        }
        return reponse;
    }

    private async baseRequestWithReAuth_<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T]
    >(method: TRequestMethods, address: string, obj: any, authenticate: boolean = true
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        await mutex.waitForUnlock();
        // @ts-ignore
        let response: ReturnType<typeof APIInterface[T][S]["args"]> = await this.baseRequest_(method, address, obj, authenticate);
        // @ts-ignore
        if (response.isFailure && response.status === 401) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refreshResponse: APIResponse<any> = await this.baseRequest_("POST", "auth/refresh/", obj, false);
                    if (refreshResponse.data) {
                        store.dispatch(appActions.setAuth());
                        store.dispatch(appActions.setAccessToken(refreshResponse.data.access));
                        store.dispatch(appActions.setRefreshToken(refreshResponse.data.refresh));
                        response = await this.baseRequest_(method, address, obj, authenticate);
                    } else {
                        response = await this.baseRequest_("POST", "auth/logout/", {})
                        store.dispatch(appActions.logout());
                    }
                } finally {
                    release();
                }
            } else {
                await mutex.waitForUnlock();
                response = await this.baseRequest_(method, address, obj, authenticate);
            }
        }
        return response;
    }

    private async baseRequest_<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T]
    >(method: TRequestMethods, address: string, obj: any, authenticate: boolean = true
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        let token = undefined;
        if (authenticate) token = store.getState().app.auth.accesToken
        try {
            const response: AxiosResponse = await this.request_api.request({
                method,
                url: `/${address}`,
                data: obj,
                headers: {
                    Authorization: authenticate ? `Bearer ${token}` : null,
                },
                withCredentials: true,
            });
            // @ts-ignore
            return await this.mapAxiosResponse_(response) as Promise<ReturnType<typeof APIInterface[T][S]["args"]>>;
        } catch (error) {
            // @ts-ignore
            return await this.mapAxiosError_(error) as Promise<ReturnType<typeof APIInterface[T][S]["args"]>>;
        }
    }


    private async mapAxiosResponse_<T>(response: AxiosResponse<T>): Promise<APIResponse<T>> {
        const apiResponse: APIResponse<T> = {
            data: response.data,
            request: response.request,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config,
            isSuccess: response.status >= 200 && response.status < 300,
            isFailure: response.status >= 400,
        };

        return apiResponse;
    }

    private async mapAxiosError_<T>(error: AxiosError<T>): Promise<APIResponse<T>> {
        const apiResponse: APIResponse<T> = {
            error: error.response?.data ?? error.message,
            request: error.request,
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            config: error.config,
            isSuccess: false,
            isFailure: true,
        };

        return apiResponse;
    }
}

export default RequestManager;

type TupleToObject<T extends any[]> = {
    [K in keyof T]: T[K]
};