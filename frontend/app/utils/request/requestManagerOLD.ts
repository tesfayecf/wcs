
import { API_INTERFACE, IApiInterface, TApiBlock } from './apiInterface';

// // // Generate QueryParams and MutationParams types
// // type QueryParams<T extends keyof typeof apiReducer.endpoints> = Parameters<
// //     typeof apiReducer.endpoints[T]['query']
// // >[0];

// // type MutationParams<T extends keyof typeof apiReducer.endpoints> = Parameters<
// //     typeof apiReducer.endpoints[T]['mutation']
// // >[0];

// class RequestHandler {
//     static instance: RequestHandler;
//     statistics: Record<string, number> = {};

//     private constructor() {
//         if (RequestHandler.instance) {
//             return RequestHandler.instance;
//         }
//         RequestHandler.instance = this;
//     }

//     // Dynamic call to an endpoint
//     async callEndpoint<T extends keyof typeof apiReducer.endpoints>(
//         endpoint: T,
//         // params: QueryParams<T> | MutationParams<T>
//         params: any,
//         // ): Promise<typeof apiReducer.endpoints[T]['response']> {
//     ): Promise<any> {
//         const endpointFn = apiReducer.endpoints[endpoint];
//         if (endpointFn) {
//             const { data } = await endpointFn(params).unwrap();
//             return data;
//         } else {
//             throw new Error(`Endpoint '${endpoint}' does not exist.`);
//         }
//     }
// }

// Generate QueryParams and MutationParams types
type QueryParams<T extends keyof IApiInterface> = Parameters<
    IApiInterface[T]["Types"]["QueryArg"]
>[0];

type MutationParams<T extends keyof IApiInterface> = Parameters<
    IApiInterface[T]["Types"]["QueryArg"]
>[0];

// type register = authApiReducer["register"]["Types"]["MutationDefinition"]["query"];

export class RequestManager {
    static instance: RequestManager;
    private constructor() { console.log("Request manager consructed") }

    public static getInstance(): RequestManager {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        console.log("Request manager instance");
        return RequestManager.instance;
    }

    async callEndpoint<T extends keyof IApiInterface>(
        block: TApiBlock,
        endpoint: T,
        params: QueryParams<T> | MutationParams<T>
    ): Promise<any> {

        const endpointData: typeof API_INTERFACE = API_INTERFACE[block][endpoint];

        // const response = endpointData.call();
        console.log(endpointData)

        // const [endpointMethod, { isLoading, error }] = endpointData();

        // endpointMethod
        // Verify(undefined)
        //     .unwrap()
        //     .then(() => {
        //         dispatch(setAuth());
        //     })
        //     .finally(() => {
        //         dispatch(finishInitialLoad());
        //     });

        // try {
        //     endpointMethod(params).unwrap().then(() => {
        //         // dispatch(setAuth());
        //         console.log("then")
        //     }).finally(() => {
        //         // dispatch(finishInitialLoad());
        //         console.log("finally")
        //     });
        // } catch (error) {
        //     throw new Error(`${endpoint}: ${error}`);
        // }

        // const mutationFn = authApiReducer.endpoints[endpoint].useMutation;
        // const [mutate, { isLoading, error }] = mutationFn();
        // console.log(mutate({}))

        // const mutationFn = authApiReducer.endpoints[endpoint].useMutation;

        // const [mutate, { isLoading, error }] = mutationFn();
        // console.log(mutate({}))



        // try {
        //     const result = await mutate(params).unwrap();
        //     return result;
        // } catch (error) {
        //     console.error('Error:', error);
        //     throw error;
        // }
    }
}