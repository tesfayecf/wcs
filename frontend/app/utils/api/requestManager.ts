import { Mutex } from "async-mutex";
import { APIInterface, APIResponse } from "./apiInterface";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { store } from "../store/store";
import { appActions } from "@/app/app/AppReducer";
const mutex = new Mutex();

class RequestManager {
    private static instance: RequestManager;
    private BASE_URL = '127.0.0.1:8000';
    private api: AxiosInstance;
    private constructor() {
        console.log("Auth handler constructor");
        this.api = this.initApi();
    }



    public static getInstance(): RequestManager {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }

        console.log("Auth handler getInstance()");
        return RequestManager.instance;
    }

    public async request<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T],
    >(
        appEventGroup: T,
        appEvent: S,
        // @ts-ignore
        args: Parameters<typeof APIInterface[T][S]["args"]>,
        isAuth: boolean = true,
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        const token = 'your-jwt-token'; // Replace with your JWT token
        // @ts-ignore
        const { endpoint, method, argsKeys } = APIInterface[appEventGroup][appEvent as string];
        const obj = Object.fromEntries(args.map((key, index) => [argsKeys[index], key]));
        const reponse = await this.baseRequestWithReAuth_(method, endpoint, obj, isAuth, token);
        if (process.env.NODE_ENV === "development") {
            console.log(`[${appEventGroup}][${appEvent as string}]`, reponse);
        }
        return reponse;
    }

    private initApi() {
        return axios.create({
            baseURL: `http://${this.BASE_URL}`,
            withCredentials: true,
            headers: {
                common: {
                    'Content-Type': 'application/json',
                },
            }
        })
    }


    private async baseRequestWithReAuth_<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T]
    >(method: "GET" | "POST", endpoint: string, obj: any, isAuth: boolean = true, token: string = ""
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {

        await mutex.waitForUnlock();
        // @ts-ignore
        let response: ReturnType<typeof APIInterface[T][S]["args"]> = await this.baseRequest_(method, endpoint, obj, isAuth, token);
        // @ts-ignore
        if (response.isFailure && response.status === 401) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refreshResponse: APIResponse<any> = await this.baseRequest_("POST", "/jwt/refresh/", obj, false);
                    if (refreshResponse.data) {
                        store.dispatch(appActions.setAuth());
                        response = await this.baseRequest_(method, endpoint, obj, isAuth, token);
                    } else {
                        store.dispatch(appActions.logout());
                    }
                } finally {
                    release();
                }
            } else {
                await mutex.waitForUnlock();
                response = await this.baseRequest_(method, endpoint, obj, isAuth, token);
            }
        }
        return response;
    }

    private async baseRequest_<
        T extends keyof typeof APIInterface,
        S extends keyof typeof APIInterface[T]
    >(method: "GET" | "POST", endpoint: string, obj: any, isAuth: boolean = true, token: string = ""
        // @ts-ignore
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        try {
            const response: AxiosResponse = await this.api.request({
                method,
                url: `/${endpoint}`,
                data: obj,
                headers: {
                    Authorization: isAuth ? `Bearer ${token}` : null,
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