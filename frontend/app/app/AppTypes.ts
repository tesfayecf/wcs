
type Role = 'admin' | 'staff' | 'user';
type Status = 'active' | 'inactive';

export interface IUserInfo {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: Status;
    lastLogin: string;
    avatar?: string;
}

export interface IAppStore {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkValue: number;
    userInfo: IUserInfo;
}

///////////////
//// ENDPOINTS
///////////////

interface User {
    first_name: string;
    last_name: string;
    email: string;
}
export interface IAppEndpoints {
    // retrieveUser: (set?: any, get?: any) => Promise<User | undefined>;
}
