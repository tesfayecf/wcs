import axios, { AxiosResponse, Method } from 'axios';


// async function makeApiRequest(
//     endpoint: string,
//     method: any,
//     params: any,
// ): Promise<ApiResponse> {
//     const token = 'your-jwt-token'; // Replace with your JWT token

//     try {
//         const response: AxiosResponse<ApiResponse> = await axios({
//             method,
//             url: `https://your-api-url.com/${endpoint}`,
//             data: params,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         // Return the response data
//         return response.data;
//     } catch (error) {
//         // Handle error here or throw it further for the caller to handle
//         throw error;
//     }
// }

// async function get<T extends keyof typeof IAppEvents, S extends keyof typeof IAppEvents[T]["methods"]>(appEventGroup: T, appEvent: S,
//     ...args: Parameters<typeof IAppEvents[T]["methods"][S]>): Promise<ReturnType<typeof IAppEvents[T]["methods"][S]>> {
//     const method = "GET";
//     // const endpoint = IAppEvents[appEventGroup]["endpoints"]["get"][appEvent]
//     // 
//     // const endpoint = IAppEvents[appEventGroup].endpoints.get[appEvent as keyof typeof IAppEvents[T]['endpoints']['get']];
//     // return request(endpoint, "GET", appEventGroup, appEvent, ...args);
// }
const IApiEnpoints: Record<string, string> = {
    login: "/api/jwt/create/"
}


type IAppEventGroup = keyof typeof IAppEvents;
type IAppEventMethod<T extends IAppEventGroup> = keyof typeof IAppEvents[T]["methods"];
type IAppEventEndpoint<T extends IAppEventGroup, M extends keyof typeof IAppEvents[T]["endpoints"]> = keyof typeof IAppEvents[T]["endpoints"][M];

export function request<
    T extends IAppEventGroup,
    S extends IAppEventMethod<T>,
    M extends "GET" | "POST"
>(
    method: M,
    appEventGroup: T,
    appEvent: S,
    ...args: Parameters<typeof IAppEvents[T]["methods"][S]>
    // ): Promise<ReturnType<typeof IAppEvents[T]["methods"][S]>> {
): ReturnType<any> {
    const token = 'your-jwt-token'; // Replace with your JWT token
    const endpoint = getApiEnpoint(appEvent as string)
    console.log(endpoint)
    // Extract the endpoint string based on appEventGroup, appEvent, and method
}

function getApiEnpoint(key: string) {
    return IApiEnpoints[key];
}


interface IEndPoint {
    get: Record<string, string>;
    post: Record<string, string>;
}

interface IAppeventType {
    methods: Record<string, (...args: any[]) => any>;
    endpoints: IEndPoint;
}

type appEv = Record<string, IAppeventType>;

const IAppEvents: appEv = {
    app: {
        methods: {
            dummy: () => "dummy",
        },
        endpoints: {
            get: {
                dummy: "/api/dummy/",
            },
            post: {},
        },
    },
    auth: {
        methods: {
            "login": (user: string, password: string): void => { },
        },
        endpoints: {
            get: {
                login: "/api/jwt/create/",
            },
            post: {},
        },
    },
    dashboard: {
        methods: {
            dummy: () => "dummy",
        },
        endpoints: {
            get: {
                dummy: "/api/dummy/",
            },
            post: {},
        },
    },
};