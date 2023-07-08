
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
    isAuthenticated: boolean;
    isLoading: boolean;
    isConnected: boolean;

    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;

    checkValue: number;
    userInfo: IUserInfo;
}

///////////////
//// ACTIONS
///////////////

export interface ISetterProps {
    value: any;
    error?: boolean;
    set?: any;
    get?: any;
}

export interface IAppActions {
    startAuthentication: (set?: any, get?: any) => void;
    finishAuthentication: (set?: any, get?: any) => void;
    setAuth: (set?: any, get?: any) => void;
    logout: (set?: any, get?: any) => void;
}