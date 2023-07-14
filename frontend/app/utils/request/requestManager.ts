import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';


class RequestManager {
    private static instance: RequestManager | null = null;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create();
    }

    public static getInstance(): RequestManager {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        return RequestManager.instance;
    }

    public setBaseURL(baseURL: string): void {
        this.axiosInstance.defaults.baseURL = baseURL;
    }

    public setHeaders(headers: AxiosRequestConfig['headers']): void {
        this.axiosInstance.defaults.headers = headers;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default RequestManager.getInstance();
