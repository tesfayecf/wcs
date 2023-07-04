
// interface APIPaths {
//     '/api/data': DataResponse;
//     '/api/users': UserResponse;
//     '/api/posts': PostResponse;
// }

// interface DataResponse {
//     id: number;
//     name: string;
// }

// interface UserResponse {
//     id: number;
//     username: string;
//     email: string;
// }

// interface PostResponse {
//     id: number;
//     title: string;
//     content: string;
// }




export interface APIResponse<T> {
    request: APIRequestInfo;
    status: number;
    statusText: string;
    headers: Record<string, any>;
    data?: T;
    error?: APIError<T>;
}

export interface APIRequestInfo {
    url: string;
    method: string;
}

export interface APIError<T> {
    message: string;
    code: number;
    data?: Partial<T>;
}


// interface UserData {
//     id: number;
//     name: string;
//     email: string;
// }

// const response: APIResponse<UserData> = {
//     request: {
//         url: '/api/users',
//         method: 'GET',
//     },
//     status: 200,
//     statusText: 'OK',
//     headers: {
//         'content-type': 'application/json',
//     },
//     data: {
//         id: 1,
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//     },
// };