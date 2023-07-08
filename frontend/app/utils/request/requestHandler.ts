import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { APIError, APIResponse, ICacheOptions, RequestProps } from './requestTypes';

class RequestHandler {
    private static instance: RequestHandler;
    private cache: Map<string, Promise<any>>;
    private cancelTokens: Map<string, CancelTokenSource>;
    private BASE_URL: string = "http://127.0.0.1:8000";

    private constructor() {
        this.cache = new Map<string, Promise<any>>();
        this.cancelTokens = new Map<string, CancelTokenSource>();
    }

    public static getInstance(): RequestHandler {
        if (!RequestHandler.instance) {
            RequestHandler.instance = new RequestHandler();
        }
        return RequestHandler.instance;
    }

    // public async get<T>(path: string, args?: T, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    //     return this.makeRequest<T>('GET', path, args, config);
    // }

    // public async post<T>(path: string, data?: T, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    //     return this.makeRequest<T>('POST', path, data, config);
    // }

    // public async put<T>(path: string, data?: T, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    //     return this.makeRequest<T>('PUT', path, data, config);
    // }

    public async get<T>(path: string, requestData: T, config?: AxiosRequestConfig, cacheOptions?: ICacheOptions): Promise<APIResponse<T>> {
        try {
            const response = await this.makeRequest<T>({ method: 'GET', path, data: requestData, config, cacheOptions });
            return response;
        } catch (error) {
            throw error;
        }
    }

    public post<T>(path: string, requestData: T, config?: AxiosRequestConfig, cacheOptions?: ICacheOptions): Promise<APIResponse<T>> {
        return this.makeRequest<T>({ method: 'POST', path, data: requestData, config, cacheOptions });
    }

    public async put<T>(path: string, requestData: T, config?: AxiosRequestConfig, cacheOptions?: ICacheOptions): Promise<APIResponse<T>> {
        try {
            const response = await this.makeRequest<T>({ method: 'PUT', path, data: requestData, config, cacheOptions });
            return response;
        } catch (error) {
            throw error;
        }
    }

    private async makeRequest<T>(requestData: RequestProps<T>): Promise<APIResponse<T>> {
        const { path, method, data, config, cacheOptions } = requestData;
        const cacheKey = `${path}-${JSON.stringify(data)}`;
        const cachedPromise = this.cache.get(cacheKey);

        if (cachedPromise && cacheOptions && !cacheOptions.overwrite) {
            return cachedPromise as Promise<APIResponse<T>>;
        }

        const cancelTokenSource = axios.CancelToken.source();
        this.cancelTokens.set(cacheKey, cancelTokenSource);

        const requestPromise = new Promise<APIResponse<T>>(async (resolve, reject) => {
            try {
                const response: AxiosResponse<T> = await axios.request<T>({
                    url: this.BASE_URL + path,
                    method: method,
                    data: data,
                    ...config,
                    cancelToken: cancelTokenSource.token,
                });

                const apiResponse: APIResponse<T> = {
                    request: {
                        url: response.config.url || '',
                        method: response.config.method || '',
                    },
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data,
                };

                resolve(apiResponse);
            } catch (error: unknown) {
                if (axios.isCancel(error)) {
                    // Handle cancellation
                } else {
                    const responseError = error as AxiosError<T>;
                    const apiError: APIError<T> = {
                        message: responseError.message,
                        code: parseInt(responseError.code || "0") || 0,
                        data: responseError.response?.data || undefined,
                    };

                    const apiResponse: APIResponse<T> = {
                        request: {
                            url: responseError.config?.url || '',
                            method: responseError.config?.method || '',
                        },
                        status: responseError.response?.status || 0,
                        statusText: responseError.response?.statusText || '',
                        headers: responseError.response?.headers || {},
                        data: responseError.response?.data || undefined,
                        error: apiError,
                    };

                    this.handleError(error);
                    reject(apiResponse);
                }
            } finally {
                this.cache.delete(cacheKey);
                this.cancelTokens.delete(cacheKey);
            }
        });

        this.cache.set(cacheKey, requestPromise);
        return requestPromise;
    }

    private handleError(error: any): void {
        // Implement your centralized error handling logic here
        console.error('Error:', error);
        // You can handle specific error types or apply retry mechanisms if appropriate
    }

    public clearCache(): void {
        this.cache.clear();
        this.cancelTokens.forEach((cancelTokenSource) => { });
        this.cancelTokens.clear();
    }
}

export default RequestHandler;






/**
 * 
Error Handling: Implement a centralized error handling mechanism to handle errors consistently and provide meaningful error messages or retry mechanisms when appropriate.

Response Interceptors: Utilize response interceptors to handle common response transformations, such as parsing JSON responses, handling error codes, or transforming data before returning it.

Request Interceptors: Utilize request interceptors to perform common request transformations, such as adding common headers or modifying the request payload.

Timeouts: Implement a timeout mechanism to cancel requests that take too long to respond. This helps prevent potential long-running requests from impacting the performance of the application.

WebSocket Integration: As mentioned in the initial request, consider integrating WebSocket functionality into the RequestHandler class to handle real-time communication efficiently.

Request Throttling: Implement request throttling to limit the number of concurrent requests to prevent overwhelming the server or API with excessive requests.

Persistent Caching: Explore options for persistent caching, such as storing cached responses in a database or using a caching layer like Redis, to persist the cache across application restarts.

Automatic Cache Expiry: Implement a mechanism to automatically expire cached data after a certain period or when the underlying data is updated.

Batch Requests: Add support for batch requests, allowing multiple requests to be combined and sent in a single HTTP request to reduce network overhead.

Authentication and Token Management: Enhance the authentication and token management logic to handle token expiration, token refreshing, and automatic token renewal.

Parallel Request Handling: Investigate opportunities for parallelizing request handling to improve performance, especially when making multiple independent requests.

Request Cancelation: Add support for canceling individual requests or canceling a group of related requests, such as canceling all requests belonging to a specific API endpoint.

Request Retry Mechanism: Implement a retry mechanism for failed requests, with configurable retry policies and exponential backoff strategies to handle temporary network issues.

Optimize Network Usage: Analyze and optimize network usage by reducing unnecessary requests, minimizing payload sizes, or utilizing compression techniques like gzip.

Rate Limiting: Implement client-side rate limiting to prevent excessive requests to the server or API, ensuring compliance with any rate limiting policies.
 */