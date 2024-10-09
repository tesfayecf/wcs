// import { ServerResponse } from './request'
// import { apiInterface } from "./interface";

// type QueryState<T> = {
//     data: T | undefined
//     isLoading: boolean
//     isError: boolean
//     error: any
// }

// export function createApi<T extends keyof typeof apiInterface>() {
//     const cache: Record<string, QueryState<any>> = {}

//     // @ts-ignore
//     function createQuery<S extends keyof typeof apiInterface[T]>(key: S, fetcher: (...args: Parameters<typeof apiInterface[T][S]["args"]>) =>
//         // @ts-ignore
//         Promise<ServerResponse<ReturnType<typeof apiInterface[T][S]["args"]>>>) {
//         return {
//             // @ts-ignore
//             useQuery: (...args: Parameters<typeof apiInterface[T][S]["args"]>) => {
//                 const cacheKey = `${key as string}:${JSON.stringify(args)}`

//                 if (!cache[cacheKey]) {
//                     cache[cacheKey] = { data: undefined, isLoading: true, isError: false, error: null }
//                 }

//                 const query = async () => {
//                     try {
//                         const response = await fetcher(...args)
//                         if (response.ok) {
//                             cache[cacheKey] = { data: response.data, isLoading: false, isError: false, error: null }
//                         } else {
//                             cache[cacheKey] = { data: undefined, isLoading: false, isError: true, error: response.error }
//                         }
//                     } catch (error) {
//                         cache[cacheKey] = { data: undefined, isLoading: false, isError: true, error }
//                     }
//                 }

//                 query()

//                 // @ts-ignore
//                 return cache[cacheKey] as QueryState<ReturnType<typeof apiInterface[T][S]["args"]>>
//             },
//             invalidate: () => {
//                 Object.keys(cache).forEach(key => {
//                     if (key.startsWith(`${key as string}:`)) {
//                         delete cache[key]
//                     }
//                 })
//             }
//         }
//     }

//     return { createQuery }
// }

// import { serverRequest } from '@/app/lib/api/request'

// const api = createApi<"group">()

// export const groupApi = {
//     getGroups: api.createQuery('groups', () => serverRequest("group", "groups", [])),

//     createGroup: api.createQuery('createGroup', (name: string, location: string, description: string) => {
//         return serverRequest("group", "createGroup", [name, location, description])
//     }),

//     editGroup: api.createQuery('editGroup', (groupId: number, name: string, location: string, description: string) =>
//         serverRequest("group", "editGroup", [groupId, name, location, description])
//     ),

//     deleteGroup: api.createQuery('deleteGroup', (groupId) => serverRequest("group", "deleteGroup", [groupId])),
// }
