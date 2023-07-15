import { APIInterface, APIResponse } from "./apiInterface";
import axios, { AxiosError, AxiosResponse } from 'axios';

class RequestManager {
    private static instance: RequestManager;
    private BASE_URL = '127.0.0.1:8000';
    private constructor() {
        console.log("Auth handler constructor");
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
        // @ts-expect-error
        args: Parameters<typeof APIInterface[T][S]["args"]>,
        isAuth: boolean = true,
        // @ts-expect-error
    ): Promise<ReturnType<typeof APIInterface[T][S]["args"]>> {
        const token = 'your-jwt-token'; // Replace with your JWT token
        // @ts-expect-error
        const { endpoint, method, argsKeys } = APIInterface[appEventGroup][appEvent as string];
        const obj = Object.fromEntries(args.map((key, index) => [argsKeys[index], key]));
        try {
            const response: AxiosResponse = await axios({
                method,
                url: `http://${this.BASE_URL}/${endpoint}`,
                data: obj,
                headers: {
                    Authorization: isAuth ? `Bearer ${token}` : null,
                },
            });
            // @ts-expect-error
            return await this.mapAxiosResponse(response) as Promise<ReturnType<typeof APIInterface[T][S]["args"]>>;
        } catch (error) {
            // @ts-expect-error
            return await this.mapAxiosError(error) as Promise<ReturnType<typeof APIInterface[T][S]["args"]>>;
        }
    }

    private async mapAxiosResponse<T>(response: AxiosResponse<T>): Promise<APIResponse<T>> {
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

    private async mapAxiosError<T>(error: AxiosError<T>): Promise<APIResponse<T>> {
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